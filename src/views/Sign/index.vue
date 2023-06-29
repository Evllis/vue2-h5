<template>
    <div class="sign-page">
        <NavBar :title="title" :left-arrow="false" :style="{ paddingLeft: '15px' }" />
        <div class="body-container sign-page__body">
            <div class="loading-wrap">
                <Loading />
            </div>
            <Form v-if="!isSign">
                <div class="flex items-center flex-col buttons">
                    <Button plain type="primary" native-type="button" @click="focusBig" class="mb-10px">
                        <Icon name="plus" />
                    </Button>
                    <Button plain type="primary" native-type="button" @click="focusSmall">
                        <Icon name="minus" />
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
                <div class="submit-footer">
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
            <div v-else class="flex flex-ai flex-col items-center sing-success mt-1/3">
                <VanImage :src="auditSuccess" class="mb-24px" />
                <p class="text-center">合同已签署成功，请线下联系您的客户经理完成业务受理</p>
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
import { isPhone, digitInteger } from '@/utils/validate'

// import { signContract } from '@/api/sign'
import { getRealName, realNameAuth } from '@/api/sign'

import { useCache } from '@/hooks/useCache'
import auditSuccess from '@/assets/img/audit-success.png'
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

// const countdown = ref(5000)
// const countShow = ref(true)
const show = ref(false)

const pdfdata = ref(undefined)
const numPages = ref(0)
const scale = ref(1)

// 获取手机验证码
const getCode = () => {
    formRef.value
        .validate('phone')
        .then(async () => {
            console.log(1111111, corporate.data.corporatePhone)
            const token = wsCache.get('token') || ''
            if (token) {
                const res = await realNameAuth({
                    headers: {
                        Authorization: token
                    },
                    data: {
                        corporateName: formData.value.corporateName,
                        corporateId: formData.value.corporateId,
                        corporatePhone: corporate.data.corporatePhone
                    }
                })
                if (!isEmpty(res)) {
                    flowId.value = res.data.flowId
                }
                console.log(22222, res)
            } else {
                wsCache.clear()
                $toast.fail({
                    message: '请重新登录',
                    onClose: () => {
                        router.push({ name: 'Login' })
                    }
                })
            }
            // if (!isEmpty(res) && +res.returnCode === 1000) {
            //     $toast.success('发送成功')
            //     codeButton.data.disabled = true
            //     renderMobileCode()
            //     return false
            // }
            // res.returnMsg || $toast.fail(res.returnMsg)
        })
        .catch(() => {})
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
        console.log(111111, corporate.data)
    }
}

const userSign = () => {
    show.value = true
    console.log(222222)
}

const focusBig = () => {
    scale.value = scale.value + 0.1
    if (scale.value >= 2) {
        scale.value = 2
    }
}

const modifyPhone = () => {
    phoneReadonly.value = false
    console.log(555555, phoneInputRef.value)
    setTimeout(() => {
        phoneInputRef.value.focus()
    }, 100)
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
            console.log(11111111)
            // const enterpriseId = wsCache.get('enterpriseId')
            // if (!enterpriseId) {
            //     $toast.fail({
            //         message: '请重新登录',
            //         onClose: () => {
            //             router.push({ name: 'Login' })
            //         }
            //     })
            //     return false
            // }
            // try {
            //     await signContract({
            //         data: {
            //             enterpriseId
            //         }
            //     })
            //     title.value = '签署成功'
            //     isSign.value = true
            // } catch (err) {
            //     return false
            // }
        })
        .catch(() => {})
}

const filterProtocol = url => {
    if (url.indexOf('http') === -1) {
        return `https://${url}`
    }
    return url
}

onMounted(() => {
    document.querySelector('html').classList.add('overflow-hidden')
    let url = wsCache.get('pdfurl')
    isSign.value = !!router.currentRoute.params.isSign
    if (url) {
        // setTimeout(() => countdownRef.value.start(), 1000)
        // 如果是本地开发的时候，则打开下面的处理，使用代理访问，否则会出现跨域
        // 线上的话，要注释掉下面的处理
        if (IS_STAGING) {
            url = `${location.origin}/api/${url.split('www.techwis.cn/')[1]}`
        } else {
            url = filterProtocol(url)
        }
        pdfdata.value = pdf.createLoadingTask({
            url,
            cMapPacked: true,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@2.0.943/cmaps/'
        })
        pdfdata.value.then(pdf => {
            numPages.value = pdf.numPages
            getLoadSuccess()
        })
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
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #ececec;
            color: #818181;
            border-color: #ccc;
            padding: 0;
            font-size: 12px;
            &::before,
            &::after {
                border-radius: 100%;
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
