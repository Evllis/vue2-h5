<template>
    <div class="sign-page">
        <NavBar :title="title" :left-arrow="false" :style="{ paddingLeft: '15px' }" />
        <div class="body-container sign-page__body">
            <div class="loading-wrap">
                <Loading />
            </div>
            <Form v-if="!isSign">
                <div class="flex items-center flex-col buttons" v-if="isSignSuccess">
                    <Button plain type="primary" native-type="button" @click="focusBig" class="mb-10px">
                        <Icon name="plus" />
                        <span class="span-text block">放大</span>
                    </Button>
                    <Button plain type="primary" native-type="button" @click="focusSmall" class="mb-10px">
                        <Icon name="minus" />
                        <span class="span-text block">缩小</span>
                    </Button>
                    <Button plain type="primary" native-type="button" class="save-pdf" @click="savePdf">
                        <VanImage :src="savePdfIcon" class="w-20px h-20px" />
                        <span class="span-text block">保存协议</span>
                    </Button>
                </div>
                <div class="form-wrap pt-25px">
                    <div id="preview-pdf" :style="{ transform: `scale(${scale})`, 'transform-origin': 'left top' }">
                        <pdf
                            :src="pdfdata"
                            v-for="i in numPages"
                            :key="i"
                            :id="i"
                            :page="i"
                            :annotation="false"
                            :text="true"
                            :resize="true"
                            @link-clicked="handle_pdf_link"
                            class="relative"
                        />
                    </div>
                </div>
                <div class="submit-footer" v-if="!isSignSuccess">
                    <VanButton block type="info" native-type="button" class="submit-button" @click="userSign"
                        >确定</VanButton
                    >
                    <!-- <VanButton block type="info" native-type="submit" class="submit-button" :disabled="countShow">
                        <div class="flex flex-ai">
                            <span class="mr-6px">签署协议</span>
                            <CountDown
                                v-if="countShow"
                                :time="countdown"
                                :auto-start="false"
                                format="ss"
                                ref="countdownRef"
                                @change="countDownChange"
                            >
                                <template #default="timeData">
                                    <span>({{ timeData.seconds }}s)</span>
                                </template>
                            </CountDown>
                        </div>
                    </VanButton> -->
                </div>
            </Form>
            <!-- <div v-else class="flex flex-ai flex-col items-center sing-success mt-1/3">
                <VanImage :src="auditSuccess" class="mb-24px" />
                <p class="text-center">合同已签署成功，请线下联系您的客户经理完成业务受理</p>
            </div> -->
            <div v-if="signReject" class="flex flex-ai flex-col items-center sing-success mt-1/3">
                <VanImage :src="auditFail" class="mb-24px" />
                <p class="text-center">协议内容有误，请联系您的大客户经理确认协议内容</p>
                <!-- <VanButton
                    block
                    type="info"
                    native-type="button"
                    class="submit-button w-170px mt-24px"
                    @click="refreshSign"
                    >刷新</VanButton
                > -->
            </div>
        </div>
        <Popup v-model="show" closeable round get-container="#app" @opened="getRealNameAccess">
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
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { NavBar, Form, Field, Image as VanImage, Button, Icon, Loading, Popup } from 'vant'
import pdf from 'pdfvuer'
import 'pdfjs-dist/build/pdf.worker.entry' // not needed since v1.9.1
import router from '@/router'
import axios from 'axios'
import { isPhone, digitInteger } from '@/utils/validate'

import { getRealName, realNameAuth, realNameSendMsg, signContract } from '@/api/sign'
// import { queryAudit } from '@/api/audit'

import { useCache } from '@/hooks/useCache'
// import auditSuccess from '@/assets/img/audit-success.png'
import auditFail from '@/assets/img/audit-fail.png'
import savePdfIcon from '@/assets/icon/save-pdf-icon.png'
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
// const countdownRef = ref()
const isSign = ref(false)
// 用户是否已经签署协议
// const userSignStatus = ref(false)
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

// const auditStatus = ref(0)
// const auditExpireTime = ref('')
// const auditList = ref([])
// const contractUrl = ref('')

// const countdown = ref(5000)
// const countShow = ref(true)
const show = ref(false)

const pdfdata = ref(undefined)
const numPages = ref(0)
const scale = ref(1)
const codeTimer = ref(0)
const codeTime = ref(60)
const sendButtonDisabled = ref(false)
const isSignSuccess = ref(false)
const signReject = ref(false)
const pdfUrl = ref('')

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

// const refreshSign = async () => {
//     const token = wsCache.get('token') || ''
//     const enterpriseId = wsCache.get('enterpriseId') || ''
//     if (token && enterpriseId) {
//         const res = await queryAudit({
//             headers: {
//                 Authorization: token
//             },
//             data: {
//                 enterpriseId
//             },
//             hideloading: true
//         })
//         if (!isEmpty(res)) {
//             // 旧 - res.data.auditStatus: 审核状态：1-未提交 2-审核中 3-审核通过 4-审核驳回 5-审核拒绝
//             // 新 - 审核状态：1-未提交 2-资质审核中 3-资质驳回 4-资质拒绝 5-协议待上传 6-协议待签署 7-协议已签署 8-协议驳回
//             wsCache.delete('isSignSuccess')
//             auditStatus.value = res.data.auditStatus
//             if (+auditStatus.value === 8) {
//                 $toast.fail('协议未生成，请联系大客经理确认')
//                 return false
//             }
//             // 审核失效时间 auditStatus = 4 时存在
//             auditExpireTime.value = res.data.auditExpireTime || ''
//             // if (+res.data.auditStatus === 2) {
//             //     auditMsg.value = '您的授信审核已提交，预计T+1审核完成'
//             // } else if (+res.data.auditStatus === 3) {
//             //     auditMsg.value = '审核通过'
//             // } else if (+res.data.auditStatus === 4) {
//             //     auditMsg.value = '审核驳回'
//             //     // setTimeout(() => router.push({ name: stepMap[res.data.auditList.step] }), 1500)
//             // } else if (+res.data.auditStatus === 5) {
//             //     auditMsg.value = '您司不符合准入标准，xxxx年xx月xx日可再次提交审核'
//             // }
//             // 审核驳回信息列表 auditStatus = 3 时存在
//             if (+auditStatus.value === 3) {
//                 auditList.value = res.data.auditList.map(item => item)
//             }
//             // 已填充好，准备签章pdf协议地址 auditStatus = 6和7 时存在
//             if (+auditStatus.value === 6 || +auditStatus.value === 7) {
//                 contractUrl.value = res.data.contractUrl
//                 wsCache.set('pdfurl', contractUrl.value || '')
//                 wsCache.set('isSignSuccess', +auditStatus.value === 7)
//                 router.push({
//                     name: 'Sign'
//                 })
//             }
//         }
//     } else {
//         $toast.fail({
//             message: '请重新登录',
//             onClose: () => {
//                 router.push({ name: 'Login' })
//             }
//         })
//     }
// }

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
                corporateName: res.data.corporateName ? `${res.data.corporateName}`.replace(/(?<=.)./g, '*') : '',
                corporateId: res.data.corporateId
                    ? `${res.data.corporateId}`.replace(/^(.{6})(?:\d+)(.{4})$/, '$1********$2')
                    : '',
                corporatePhone: res.data.corporatePhone
            }
        }
    }
}

const userSign = () => {
    show.value = true
}

const focusBig = () => {
    scale.value = scale.value + 0.1
    if (scale.value >= 2) {
        scale.value = 2
    }
}

const modifyPhone = () => {
    if (isCodeSend.value) return false
    phoneReadonly.value = false
    setTimeout(() => {
        phoneInputRef.value.focus()
    }, 100)
}

const savePdf = () => {
    $toast.loading({
        message: '下载中...',
        forbidClick: true
    })
    axios(pdfUrl.value, {
        //pdf的位置
        responseType: 'blob' //重要代码
    }).then(res => {
        const customUrl = pdfUrl.value.split('/')
        const name = customUrl[customUrl.length - 1].split('.')[0]
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        const fileName = `${name || 'download'}.pdf` //保存到本地的文件名称
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        $toast.clear()
    })
}

const focusSmall = () => {
    scale.value = scale.value - 0.1
    if (scale.value <= 1) {
        scale.value = 1
    }
}

const getElement = (parent, children) => {
    let timer = 0
    return new Promise(reject => {
        timer = setInterval(() => {
            const res = parent.querySelector(children)
            if (res) {
                clearInterval(timer)
                reject(res)
            }
        }, 500)
    })
}
const getLoadSuccess = async () => {
    const previewPdf = document.querySelector('#preview-pdf')
    const isChildren = await getElement(previewPdf, 'div')
    const textLayer = await getElement(isChildren, '.textLayer')
    if (textLayer) {
        document.querySelector('html').classList.remove('overflow-hidden')
    }
}

const handle_pdf_link = params => {
    const page = document.getElementById(String(params.pageNumber))
    page.scrollIntoView()
}

// const countDownChange = val => {
//     if (val.seconds <= 0) {
//         countShow.value = false
//         countdownRef.value.pause()
//     }
// }

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
                    $toast.success('签署成功')
                    isSignSuccess.value = true
                    renderPdf(res.data.contractUrl)
                } else {
                    $toast.fail(res.returnMsg || '签署失败')
                }
                // title.value = '签署成功'
                // isSign.value = true
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

const renderPdf = url => {
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
        getLoadSuccess()
    })
}

onMounted(() => {
    document.querySelector('html').classList.add('overflow-hidden')
    let url = wsCache.get('pdfurl')
    const signReject1 = wsCache.get('signReject')
    const isSignSuccess1 = wsCache.get('isSignSuccess')
    isSign.value = !!router.currentRoute.params.isSign
    if (isSignSuccess1) {
        isSignSuccess.value = true
    }
    if (signReject1) {
        signReject.value = true
        document.querySelector('html').classList.remove('overflow-hidden')
        isSign.value = true
    }
    if (url) {
        renderPdf(url)
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
