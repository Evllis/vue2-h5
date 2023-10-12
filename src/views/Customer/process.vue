<template>
    <div class="process-page">
        <NavBar title="查看进度" left-arrow @click-left="backRouter" />
        <div class="body-container process-page__body">
            <div class="flex justify-between items-center process-page__header">
                <span>企业名称A</span>
                <span :class="className">业务进度：已完成 ></span>
            </div>
            <div class="process-page__wrap">
                <ul class="process-page__list">
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">完成签收</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">供货方完成发货</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                    <li class="process-page__item">
                        <h4 class="process-page__item-title">发起发货申请</h4>
                        <div class="process-page__item-date">2023-09-13 13:11:12</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NavBar, Toast } from 'vant'
import router from '@/router'

const className = ref('')

// 返回上一页
const backRouter = () => {
    router.back()
}

onMounted(() => {
    Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '倒计时 3 秒'
    })
})
</script>

<style lang="scss" scoped>
.process-page {
    &__body {
        padding: 75px 14px 25px 14px;
        color: #2a314d;
        font-size: 14px;
    }
    &__header {
        margin-bottom: 25px;
    }
    &__wrap {
        padding-left: 30px;
        margin-left: 18px;
        margin-bottom: 130px;
        position: relative;
        &::before {
            content: '';
            width: 2px;
            height: 100%;
            background: url('~@/assets/icon/process-line-icon.png') repeat-y left top;
            background-size: 2px 84px;
            position: absolute;
            left: 0;
            top: 12px;
        }
    }
    &__list {
        .process-page__item {
            margin-bottom: 43px;
            position: relative;
            &::before {
                content: '';
                width: 22px;
                height: 22px;
                position: absolute;
                left: -40px;
                top: 0;
                background: url('~@/assets/icon/process-mark-icon.png') no-repeat center;
                background-size: 21px 21px;
            }
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    &__item-title {
        font-size: 14px;
        line-height: 21px;
        margin-bottom: 6px;
    }
    &__item-date {
        font-size: 12px;
        line-height: 14px;
        color: #aeb3c1;
    }
}
</style>
