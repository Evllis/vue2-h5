<template>
    <div class="sign-page">
        <NavBar :title="title" left-arrow @click-left="backRouter" />
        <div class="body-container sign-page__body">
            <div class="form-wrap">
                <div class="form-item">
                    <div>{{ contractCode }}</div>
                    <a href="javascript:void(0);" class="link" @click="savePdf">下载</a>
                </div>
            </div>
            <div class="submit-footer">
                <VanButton block type="info" native-type="button" class="submit-button" @click="shareSign"
                    >分享给客户：{{ enterpriseName }}</VanButton
                >
            </div>
        </div>
        <Popup
            v-model="show"
            closeable
            round
            get-container="#app"
            @opened="getRealNameAccess"
            @closed="phoneReadonly = true"
        >
            <Form
                @submit="onSubmit"
                :validate-first="true"
                :validate-trigger="'onSubmit'"
                class="relative h-full"
                ref="formRef"
            >
                <Field v-model="corporate.data.corporateName" type="text" label="姓名" readonly />
                <Field v-model="corporate.data.corporateId" type="text" label="身份证号" readonly />
                <Field
                    v-model="corporate.data.corporatePhone"
                    type="tel"
                    name="phone"
                    label="手机号"
                    ref="phoneInputRef"
                    :readonly="phoneReadonly"
                    :rules="rules.phone"
                    @blur="phoneReadonly = true"
                >
                    <template #button>
                        <span class="text-[var(--primary-active-color)] fs-14" @click="modifyPhone">修改</span>
                    </template>
                </Field>
                <Field
                    v-model="code"
                    type="digit"
                    label="验证码"
                    placeholder="请输入验证码"
                    maxlength="6"
                    :rules="rules.code"
                >
                    <template #button>
                        <span
                            class="text-[var(--primary-active-color)] fs-14 get-code"
                            :disabled="codeButton.data.disabled"
                            @click="getCode"
                            >{{ codeButton.data.text }}</span
                        >
                    </template>
                </Field>
                <div class="flex justify-center">
                    <VanButton block type="info" native-type="submit" class="submit-button">确定</VanButton>
                </div>
            </Form>
        </Popup>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, nextTick } from 'vue'
import { NavBar, Form, Field, Popup } from 'vant'
import router from '@/router'
import axios from 'axios'
import NativeShare from 'nativeshare'
import { isPhone, digitInteger } from '@/utils/validate'

import { getRealName, realNameAuth, realNameSendMsg, signContract } from '@/api/sign'
import { shareContract } from '@/api/common'

import { hideName, hideIdCard } from '@/utils'
import { useCache } from '@/hooks/useCache'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const rules = reactive({
    phone: [
        { required: true, message: '请填写手机号' },
        { validator: isPhone, message: '请输入正确的手机号' }
    ],
    code: [
        { required: true, message: '请填写验证码' },
        { validator: digitInteger, message: '请输入正确的验证码' }
    ]
})

const codeButton = reactive({
    data: {
        disabled: false,
        text: '发送验证码'
    }
})

const IS_STAGING = process.env.VUE_APP_ENV === 'staging'
const code = ref('')
const title = ref('签署协议')
const formRef = ref()
const phoneInputRef = ref()
const isSign = ref(false)
const phoneReadonly = ref(true)
const isCodeSend = ref(false)
const flowId = ref('')
const formData = ref({
    corporateName: '',
    corporateId: '',
    corporatePhone: ''
})
const corporate = reactive({
    data: {
        corporateName: '',
        corporateId: '',
        corporatePhone: ''
    }
})

const show = ref(false)

const codeTimer = ref(0)
const codeTime = ref(60)
const sendButtonDisabled = ref(false)
const isSignSuccess = ref(false)
const signReject = ref(false)
const pdfUrl = ref('')
const weixinConfig = reactive({
    data: {}
})
const contractCode = ref('')
const enterpriseName = ref('')

const backRouter = () => {
    router.push({ name: 'Login' })
}

// 获取手机验证码
const getCode = () => {
    if (sendButtonDisabled.value) return false
    formRef.value
        .validate('phone')
        .then(async () => {
            const token = wsCache.get('token') || ''
            if (token) {
                let res = null
                if (!flowId.value) {
                    res = await realNameAuth({
                        headers: {
                            Authorization: token
                        },
                        data: {
                            corporateName: formData.value.corporateName,
                            corporateId: formData.value.corporateId,
                            corporatePhone: corporate.data.corporatePhone
                        }
                    })
                } else {
                    res = await realNameSendMsg({
                        headers: {
                            Authorization: token
                        },
                        data: {
                            flowId: flowId.value
                        }
                    })
                }
                if (!isEmpty(res) && !flowId.value) {
                    flowId.value = res.data.flowId
                }
                if (+res.returnCode === 1000) {
                    sendButtonDisabled.value = true
                    isCodeSend.value = true
                    phoneReadonly.value = true
                    $toast.success('发送成功')
                    renderMobileCode()
                } else {
                    $toast.fail(res.returnMsg || '发送失败')
                }
            } else {
                wsCache.clear()
                $toast.fail({
                    message: '请重新登录',
                    onClose: () => {
                        router.push({ name: 'Login' })
                    }
                })
            }
        })
        .catch(() => {})
}

const renderMobileCode = () => {
    codeTimer.value = setTimeout(() => {
        codeTime.value--
        codeButton.data.text = `${codeTime.value}s后重新获取`
        if (codeTime.value <= 0) {
            clearTimeout(codeTimer.value)
            codeButton.data = {
                text: '获取验证码',
                disabled: false
            }
            codeTime.value = 60
            sendButtonDisabled.value = false
            isCodeSend.value = false
        } else {
            renderMobileCode()
        }
    }, 1000)
}

const getRealNameAccess = async () => {
    if (corporate.data.corporateName) return false
    const token = wsCache.get('token') || ''
    const enterpriseId = wsCache.get('enterpriseId') || ''
    if (token && enterpriseId) {
        const res = await getRealName({
            headers: {
                Authorization: token
            },
            data: {
                enterpriseId
            }
        })
        if (!isEmpty(res)) {
            formData.value = { ...res.data }
            corporate.data = {
                corporateName: res.data.corporateName ? hideName(res.data.corporateName) : '',
                corporateId: res.data.corporateId ? hideIdCard(res.data.corporateId, 6, 4) : '',
                corporatePhone: res.data.corporatePhone
            }
        }
    }
}

const modifyPhone = async () => {
    if (isCodeSend.value) return false
    phoneReadonly.value = false
    await nextTick()
    phoneInputRef.value.focus()
}

const savePdf = () => {
    $toast.loading({
        message: '下载中...',
        forbidClick: true
    })
    axios(pdfUrl.value, {
        responseType: 'blob'
    }).then(res => {
        const customUrl = pdfUrl.value.split('/')
        const name = customUrl[customUrl.length - 1].split('.')[0]
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        const fileName = `${name || 'download'}.pdf`
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        $toast.clear()
    })
}

const shareSign = () => {
    const nativeShare = new NativeShare()

    const shareData = {
        title: 'NativeShare',
        desc: 'NativeShare是一个整合了各大移动端浏览器调用原生分享的插件',
        // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
        link: 'https://github.com/fa-ge/NativeShare',
        icon: 'https://pic3.zhimg.com/v2-080267af84aa0e97c66d5f12e311c3d6_xl.jpg',
        // 不要过于依赖以下两个回调，很多浏览器是不支持的
        success() {
            alert('success')
        },
        fail() {
            alert('fail')
        }
    }

    nativeShare.setShareData(shareData)

    try {
        nativeShare.call()
        // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
        // 类似的命令有
        //  default 默认，调用起底部的分享组件，当其他命令不支持的时候也会调用该命令
        //  wechatTimeline 分享到朋友圈
        //  wechatFriend 分享给微信好友
        //  qqFriend 分享给QQ好友
        //  qZone 分享到QQ空间
        // $toast.success('支持')
    } catch (err) {
        // 如果不支持，你可以在这里做降级处理
        $toast.fail('您的浏览器不支持该分享功能，请手动复制链接!')
    }
}

const onSubmit = async () => {
    formRef.value
        .validate()
        .then(async () => {
            const enterpriseId = wsCache.get('enterpriseId')
            const token = wsCache.get('token') || ''
            if (!enterpriseId || !token) {
                $toast.fail({
                    message: '请重新登录',
                    onClose: () => {
                        router.push({ name: 'Login' })
                    }
                })
                return false
            }
            try {
                show.value = false
                const res = await signContract({
                    headers: {
                        Authorization: token
                    },
                    data: {
                        enterpriseId,
                        flowId: flowId.value,
                        authcode: code.value,
                        phone: corporate.data.corporatePhone
                    }
                })
                if (+res.returnCode === 1000) {
                    isSignSuccess.value = true
                    wsCache.delete('pdfurl')
                    $toast.success({
                        message: '签署成功'
                    })
                } else {
                    $toast.fail(res.returnMsg || '签署失败')
                }
            } catch (err) {
                $toast.fail('签署失败')
            }
        })
        .catch(() => {})
}

const filterProtocol = url => {
    if (url.indexOf('http') === -1) {
        return `https://${url}`
    }
    return url
}

const getWeixinConfig = async () => {
    const res = await shareContract({
        data: {
            url: window.location.href
        }
    })
    console.log(res)
}

onMounted(async () => {
    var broser = window.navigator.userAgent.toLowerCase()
    if (broser.match(/MicroMessenger/i) == 'micromessenger') {
        getWeixinConfig()
    }
    getWeixinConfig()
    console.log(weixinConfig.data)
    contractCode.value = wsCache.get('contractCode') || ''
    enterpriseName.value = wsCache.get('enterpriseName') || ''
    let url = wsCache.get('pdfurl')
    const signReject1 = wsCache.get('signReject')
    const isSignSuccess1 = wsCache.get('isSignSuccess')
    isSign.value = !!router.currentRoute.params.isSign
    if (isSignSuccess1) {
        isSignSuccess.value = true
    }
    if (signReject1) {
        signReject.value = true
        isSign.value = true
    }
    if (url) {
        if (IS_STAGING) {
            pdfUrl.value = `${location.origin}/api/${decodeURIComponent(url).split('www.techwis.cn/')[1]}`
        } else {
            pdfUrl.value = filterProtocol(decodeURIComponent(url))
        }
    }
})
</script>

<style lang="scss" scoped>
html {
    .loading-wrap {
        display: none;
    }
    &.overflow-hidden {
        .loading-wrap {
            display: block;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
        }
    }
}
.sign-page {
    .form-wrap {
        background-color: #fbfbfb;
    }
    .form-item {
        padding: 16px 0;
        font-size: 14px;
        color: #2a314d;
        line-height: 14px;
        display: flex;
        justify-content: space-between;
        background-color: white;
        .link {
            color: #ff5f01;
            text-decoration: underline;
        }
    }
    .buttons {
        position: fixed;
        right: 15px;
        bottom: 30%;
        z-index: 10;
        button {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 0;
            font-size: 10px;
            border: 0;
            &::before,
            &::after {
                border-radius: 100%;
            }
            i {
                font-size: 22px;
            }
            .span-text {
                transform: scale(0.8);
            }
        }
    }
    :deep(.page) {
        position: relative;
        left: -16px;
    }
    .van-count-down {
        color: inherit;
    }
    .sing-success {
        :deep(img) {
            width: 98px;
        }
        p {
            font-size: 14px;
            line-height: 18px;
            color: #ff5f01;
            max-width: 238px;
        }
    }
}
.van-popup {
    width: 80%;
    padding: 30px 15px;
    .fs-14 {
        font-size: 14px;
    }
    .submit-button {
        width: 94% !important;
    }
}
</style>
