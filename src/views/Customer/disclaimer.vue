<template>
    <div class="disclaimer-page">
        <NavBar title="免责声明" left-arrow @click-left="backRouter" />
        <div class="body-container disclaimer-page__body">
            <div class="pt-22px pr-15px pl-15px">
                <p class="mb-20px">
                    以下流程将要求您提交客户单位的相关资质文件，请确认您已经取得客户单位的授权，允许您将这类文件提交至本平台。
                </p>
                <p class="indent">如未取得授权，请终止流程。</p>
            </div>
            <div class="submit-footer">
                <VanButton block type="info" native-type="button" class="submit-button" @click="accept"
                    >我已知晓，继续</VanButton
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { NavBar } from 'vant'
import router from '@/router'

const instance = getCurrentInstance()
const { $store } = instance.proxy

// 我已知晓
const accept = () => {
    $store.commit('app/SET_ENTERPRISE_ID', '')
    router.push({
        name: 'Enterprise'
    })
}

// 返回上一页
const backRouter = () => {
    router.push({ name: 'List' })
}
</script>

<style lang="scss" scoped>
.disclaimer-page {
    p {
        font-size: 16px;
        color: #2a314d;
        line-height: 22px;
        &.indent {
            text-indent: 24px;
        }
    }
}
</style>
