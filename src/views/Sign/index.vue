<template>
    <div class="sign-page">
        <NavBar :title="isSignSuccess ? '协议预览' : '签署协议'" left-arrow @click-left="backRouter" />
        <div class="body-container sign-page__body" :style="isSignSuccess ? { 'padding-bottom': '0' } : ''">
            <div class="form-wrap" :style="isSignSuccess ? { 'padding-bottom': '0' } : ''">
                <div class="form-item">
                    <div class="title">
                        <p>{{ contractCode }}</p>
                        <p>《集团客户服务合同》</p>
                    </div>
                    <a href="javascript:void(0);" class="link" @click="savePdf">下载</a>
                </div>
                <div v-if="isSignSuccess" class="pdf-cont flex-1">
                    <div class="flex items-center flex-col buttons">
                        <Button plain type="primary" native-type="button" @click="focusBig" class="mb-10px">
                            <Icon name="plus" />
                            <span class="span-text block">放大</span>
                        </Button>
                        <Button plain type="primary" native-type="button" @click="focusSmall" class="mb-10px">
                            <Icon name="minus" />
                            <span class="span-text block">缩小</span>
                        </Button>
                    </div>
                    <div
                        v-if="isRender"
                        id="preview-pdf"
                        :style="{ transform: `scale(${scale})`, 'transform-origin': 'left top' }"
                    >
                        <pdf
                            :src="pdfdata"
                            v-for="i in numPages"
                            :key="i"
                            :id="i"
                            :page="i"
                            :annotation="false"
                            :text="true"
                            :resize="true"
                            :scaleNum="0.5"
                            @link-clicked="handle_pdf_link"
                            class="relative"
                        />
                    </div>
                </div>
            </div>
            <div class="submit-footer" v-if="!isSignSuccess">
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
        <Overlay :show="overlayShow">
            <div class="overlay-wrapper">
                <img :src="overlayBg" class="overlay-bg" />
                <img :src="overlayButton" class="overlay-button" @click.stop="overlayShow = false" />
            </div>
        </Overlay>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, nextTick } from 'vue'
import { NavBar, Form, Field, Popup, Overlay, Icon } from 'vant'
import router from '@/router'
import axios from 'axios'
import pdf from 'pdfvuer'
import 'pdfjs-dist/build/pdf.worker.entry' // not needed since v1.9.1
import NativeShare from 'nativeshare'

import { isPhone, digitInteger } from '@/utils/validate'

import { getRealName, realNameAuth, realNameSendMsg, signContract } from '@/api/sign'
import { queryAudit } from '@/api/audit'
import { getJsSdkConfig } from '@/api/common'

import { hideName, hideIdCard } from '@/utils'
import { isBrowser } from '@/utils/is'
import { weixinShare } from '@/utils/weixinShare'
import { useCache } from '@/hooks/useCache'
import { isEmpty } from 'lodash-es'

import overlayBg from '@/assets/img/overlay-bg.png'
import overlayButton from '@/assets/img/overlay-button.png'

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
const formRef = ref()
const phoneInputRef = ref()
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
const overlayShow = ref(false)
const isRender = ref(true)
const scale = ref(1)
const numPages = ref(0)
const pdfdata = ref(undefined)

const codeTimer = ref(0)
const codeTime = ref(60)
const sendButtonDisabled = ref(false)
const isSignSuccess = ref(false)
const pdfUrl = ref('')
const weixinConfig = reactive({
    data: {}
})
const contractCode = ref('')
const enterpriseName = ref('')
const customerName = ref('')
const linkUrl = ref('')

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

const filterShareUrl = () =>
    linkUrl.value ? filterProtocol(linkUrl.value) : 'https://www.techwis.cn/commercialEnterprise/user/'

const setShareData = () => {
    if (isBrowser().safari) {
        const meta1 = document.querySelector('#shareTitle')
        meta1.content = '天安商企服务平台'

        const meta2 = document.querySelector('#shareImage')
        meta2.content = 'https://www.techwis.cn/commercialEnterprise/techwis.png'

        const meta3 = document.querySelector('#shareDescription')
        meta3.content = `您有一份协议待签署（${contractCode.value}《集团客户服务协议》），前往查看>`

        const meta4 = document.querySelector('#shareUrl')
        meta4.content = filterShareUrl()
    }
}

const shareSign = async () => {
    if (isBrowser().weixin) {
        overlayShow.value = true
        return false
    }
    const nativeShare = new NativeShare()
    const shareData = {
        wechatConfig: {
            appId: weixinConfig.data.appId,
            nonceStr: weixinConfig.data.nonceStr,
            signature: weixinConfig.data.signature,
            timestamp: weixinConfig.data.timestamp
        },
        title: '天安商企服务平台',
        desc: `您有一份协议待签署（${contractCode.value}《集团客户服务协议》），前往查看>`,
        // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
        link: filterShareUrl(),
        icon: 'https://www.techwis.cn/commercialEnterprise/techwis.png',
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
    const res = await getJsSdkConfig({
        data: {
            url: window.location.href.split('#')[0]
        }
    })
    if (res.returnCode === '1000') {
        weixinConfig.data = res.data
        weixinShare(
            {
                appId: weixinConfig.data.appId,
                nonceStr: weixinConfig.data.nonceStr,
                signature: weixinConfig.data.signature,
                timestamp: weixinConfig.data.timestamp
            },
            {
                title: '天安商企服务平台',
                desc: `您有一份协议待签署（${contractCode.value}《集团客户服务协议》），前往查看>`,
                link: decodeURIComponent(filterShareUrl()),
                imgUrl: 'https://www.techwis.cn/commercialEnterprise/techwis.png'
            }
        )
    }
}

const focusBig = () => {
    scale.value = scale.value + 0.1
    if (scale.value >= 2) {
        scale.value = 2
    }
}

const focusSmall = () => {
    scale.value = scale.value - 0.1
    if (scale.value <= 1) {
        scale.value = 1
    }
}

const renderPdf = (url, render) => {
    $toast.loading({
        message: '正在加载...',
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner'
    })
    if (render) {
        isRender.value = false
    }
    let pdfURL = ''
    if (IS_STAGING) {
        pdfURL = `${location.origin}/api/${url.split('www.techwis.cn/')[1]}`
    } else {
        pdfURL = filterProtocol(url)
    }
    pdfUrl.value = pdfURL
    pdfdata.value = pdf.createLoadingTask({
        url: pdfURL,
        cMapPacked: true,
        withCredentials: true,
        cMapUrl: './pdf/cmaps/'
    })
    pdfdata.value.then(pdf => {
        numPages.value = pdf.numPages
        if (render) {
            setTimeout(() => {
                isRender.value = true
                $toast.clear()
                // getLoadSuccess()
            }, 2000)
        } else {
            // getLoadSuccess()
        }
    })
}

const handle_pdf_link = params => {
    const page = document.getElementById(String(params.pageNumber))
    page.scrollIntoView()
}

const getPdfUrl = async () => {
    const enterpriseId = wsCache.get('enterpriseId') || ''
    const token = wsCache.get('token') || ''
    if (enterpriseId && token) {
        const res = await queryAudit({
            headers: {
                Authorization: token
            },
            data: {
                enterpriseId: enterpriseId
            },
            hideloading: true
        })
        return res.data.contractUrl
    }
    return ''
}

onMounted(async () => {
    contractCode.value = wsCache.get('contractCode') || ''
    enterpriseName.value = wsCache.get('enterpriseName') || ''
    customerName.value = wsCache.get('customerName') || ''
    linkUrl.value = wsCache.get('linkUrl') ? decodeURIComponent(wsCache.get('linkUrl')) : ''
    if (isBrowser().weixin) {
        getWeixinConfig()
    }
    setShareData()
    let url = wsCache.get('pdfurl')
    const isSignSuccess1 = wsCache.get('isSignSuccess')
    if (isSignSuccess1) {
        isSignSuccess.value = true
    }
    if (url) {
        if (IS_STAGING) {
            pdfUrl.value = `${location.origin}/api/${decodeURIComponent(url).split('www.techwis.cn/')[1]}`
        } else {
            pdfUrl.value = filterProtocol(decodeURIComponent(url))
        }
        renderPdf(decodeURIComponent(url), true)
    } else {
        const pdfUrl = await getPdfUrl()
        renderPdf(decodeURIComponent(pdfUrl), true)
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
        padding: 0 0 32px 0;
    }
    .form-item {
        font-size: 14px;
        color: #2a314d;
        line-height: 14px;
        display: flex;
        justify-content: space-between;
        background-color: white;
        align-items: flex-end;
        position: fixed;
        left: 0;
        top: 46px;
        width: 100%;
        padding: 16px 15px;
        z-index: 1;
        .title {
            flex: 1;
            line-height: 19px;
        }
        .link {
            color: #ff5f01;
            text-decoration: underline;
            margin-bottom: 2px;
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
    .pdf-cont {
        padding-top: 46px;
    }
    .overlay-bg {
        max-width: 70%;
        position: absolute;
        right: 0;
        top: 0;
    }
    .overlay-button {
        max-width: 40%;
        position: absolute;
        bottom: 30vh;
        left: 50%;
        transform: translateX(-50%);
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
