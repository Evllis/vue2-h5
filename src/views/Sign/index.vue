<template>
    <div class="sign-page">
        <NavBar :title="title" :left-arrow="false" :style="{ paddingLeft: '15px' }" />
        <div class="body-container sign-page__body">
            <Form v-if="!isSign" @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
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
                        >
                            <template slot="loading"> loading content here... </template>
                        </pdf>
                    </div>
                </div>
                <div class="submit-footer">
                    <VanButton block type="info" native-type="submit" class="submit-button" :disabled="countShow">
                        <div class="flex flex-ai">
                            <span class="mr-6px">签署协议</span>
                            <CountDown
                                v-if="countShow"
                                :time="countdown"
                                :auto-start="false"
                                format="ss"
                                ref="countdownRef"
                                @finish="countDownFinish"
                            >
                                <template #default="timeData">
                                    <span>({{ timeData.seconds }}s)</span>
                                </template>
                            </CountDown>
                        </div>
                    </VanButton>
                </div>
            </Form>
            <div v-else class="flex flex-ai flex-col items-center sing-success mt-1/3">
                <VanImage :src="auditSuccess" class="mb-24px" />
                <p class="text-center">合同已签署成功，请线下联系您的客户经理完成业务受理</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { NavBar, Form, CountDown, Image as VanImage, Button, Icon } from 'vant'
// import Pdfh5 from 'pdfh5'
// import 'pdfh5/css/pdfh5.css'
import pdf from 'pdfvuer'
import 'pdfjs-dist/build/pdf.worker.entry' // not needed since v1.9.1
import router from '@/router'

import { signContract } from '@/api/sign'

import { useCache } from '@/hooks/useCache'
import auditSuccess from '@/assets/img/audit-success.png'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const title = ref('签署协议')
const formRef = ref()
const countdownRef = ref()
const isSign = ref(false)

const countdown = ref(5000)
const countShow = ref(true)

const pdfdata = ref(undefined)
const numPages = ref(0)
const scale = ref(1)

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

const handle_pdf_link = params => {
    // Scroll to the appropriate place on our page - the Y component of
    // params.destArray * (div height / ???), from the bottom of the page div
    const page = document.getElementById(String(params.pageNumber))
    page.scrollIntoView()
}

const countDownFinish = () => {
    countShow.value = false
}

const onSubmit = async () => {
    formRef.value
        .validate()
        .then(async () => {
            const enterpriseId = wsCache.get('enterpriseId')
            if (!enterpriseId) {
                $toast.fail({
                    message: '请重新登录',
                    onClose: () => {
                        router.push({ name: 'Login' })
                    }
                })
                return false
            }
            try {
                await signContract({
                    data: {
                        enterpriseId
                    }
                })
                title.value = '签署成功'
                isSign.value = true
            } catch (err) {
                return false
            }
        })
        .catch(() => {})
}

// const filterProtocol = url => {
//     if (url.indexOf('http') === -1) {
//         const name = url.split(`${location.origin}/`)[1]
//         const str = `${location.origin}/api/${name}`
//         return str
//     }
//     return url
// }

onMounted(() => {
    const url = wsCache.get('pdfurl')
    isSign.value = !!router.currentRoute.params.isSign
    if (url) {
        setTimeout(() => countdownRef.value.start(), 1000)
        // 如果是本地开发的时候，则打开下面的处理，使用代理访问，否则会出现跨域
        // 线上的话，要注释掉下面的处理
        // pdfurl.value = `${location.origin}/api/${url.split('www.techwis.cn/')[1]}`
        pdfdata.value = pdf.createLoadingTask({
            url: `${location.origin}/api/${url.split('www.techwis.cn/')[1]}`,
            cMapPacked: true,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@2.0.943/cmaps/'
        })
        pdfdata.value.then(pdf => {
            numPages.value = pdf.numPages
            // window.onscroll = function () {
            // changePage()
            // stickyNav()
            // }

            // Get the offset position of the navbar
            // const sticky = document.querySelector('#buttons').offsetTop

            // Add the sticky class to the self.$refs.nav when you reach its scroll position. Remove "sticky" when you leave the scroll position
            // function stickyNav() {
            //     if (window.pageYOffset >= sticky) {
            //         document.querySelector('#buttons').classList.remove('hidden')
            //     } else {
            //         document.querySelector('#buttons').classList.add('hidden')
            //     }
            // }

            //     function changePage() {
            //         var i = 1,
            //             count = Number(pdf.numPages)
            //         do {
            //             if (
            //                 (document.getElementById(i) && window.pageYOffset) >= findPos(document.getElementById(i)) &&
            //                 (document.getElementById(i + 1) && window.pageYOffset) <=
            //                     findPos(document.getElementById(i + 1))
            //             ) {
            //                 page.value = i
            //             }
            //             i++
            //         } while (i < count)
            //         if ((document.getElementById(i) && window.pageYOffset) >= findPos(document.getElementById(i))) {
            //             page.value = i
            //         }
            //     }
            // })
        })
    }
})
</script>

<style lang="scss" scoped>
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
        left: -26px;
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
</style>
