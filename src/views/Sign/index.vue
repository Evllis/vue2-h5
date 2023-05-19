<template>
    <div class="sign-page">
        <NavBar :title="title" :left-arrow="false" :style="{ paddingLeft: '15px' }" />
        <div class="body-container sign-page__body">
            <Form v-if="!isSign" @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <div id="preview-pdf"></div>
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
import { NavBar, Form, CountDown, Image as VanImage } from 'vant'
import Pdfh5 from 'pdfh5/js/pdfh5.js'
import 'pdfh5/css/pdfh5.css'
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
const pdfurl = ref('')
const isSign = ref(false)

const countdown = ref(5000)
const countShow = ref(true)

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

const filterProtocol = () => {
    const protocol = location.protocol
    if (!protocol || protocol.indexOf('http') === -1) return 'https:'
    return protocol
}

onMounted(() => {
    pdfurl.value = wsCache.get('pdfurl')
    isSign.value = !!router.currentRoute.params.isSign
    if (pdfurl.value) {
        setTimeout(() => countdownRef.value.start(), 1000)
        // 如果是本地开发的时候，则打开下面的处理，使用代理访问，否则会出现跨域
        // 线上的话，要注释掉下面的处理
        // pdfurl.value = `${location.origin}/api/${pdfurl.value.split('https://www.techwis.cn/')[1]}`
        // const url = 'https://soft.xiaoz.org/office/hee%20hee.pdf'
        new Pdfh5('#preview-pdf', {
            pdfurl: `${filterProtocol()}//${pdfurl.value}`,
            lazy: true,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.2.228/cmaps/',
            cMapPacked: true
        })
    }
})
</script>

<style lang="scss" scoped>
.sign-page {
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
