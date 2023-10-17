<template>
    <div class="process-page">
        <NavBar title="查看进度" left-arrow @click-left="backRouter" />
        <div class="body-container process-page__body">
            <div class="flex justify-between items-center process-page__header">
                <span>{{ name }}</span>
                <span :class="className">业务进度：{{ progressName }}</span>
            </div>
            <div class="process-page__wrap">
                <ul class="process-page__list">
                    <li v-for="item in progressList" :key="item.status" class="process-page__item">
                        <h4 class="process-page__item-title">{{ statusName(item.status) }}</h4>
                        <div class="process-page__item-date">{{ item.createTime }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated, getCurrentInstance } from 'vue'
import { NavBar, Toast } from 'vant'
import router from '@/router'
import { isEmpty } from 'lodash-es'
import { getProgressList } from '@/api/customer'

const instance = getCurrentInstance()
const { $store } = instance.proxy

const className = ref('')
// 进度列表
const progressList = ref([])
// 进度
const progressName = ref('')
// 业务进度 2-资质审核 3-协议签署 4-发货流程
const progress = {
    2: '业务申请',
    3: '协议签署',
    4: '发货流程'
}
// 企业名称
const name = ref('')

// 返回上一页
const backRouter = () => {
    router.back()
}

// 业务状态： 2-资质审核中(发起申请) 3-资质驳回 4-资质拒绝 5-协议待上传(业务申请通过)
// 6-协议待签署(供货方发起协议) 9-等待发货(客户完成协议签署) 10-已发货
const statusName = status => {
    const json = {
        2: '发起申请',
        3: '业务申请驳回',
        4: '业务申请拒绝',
        5: '业务申请通过',
        6: '供货方发起协议',
        9: '客户完成协议签署',
        10: '供货方完成发货',
        11: '完成签收'
    }
    return json[status] || ''
}

onActivated(async () => {
    const enterpriseId = $store.getters['app/enterpriseId'] || ''
    Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '正在加载...'
    })
    if (!enterpriseId) {
        Toast.clear()
        return
    }
    const res = await getProgressList({
        data: {
            enterpriseId
        }
    })
    if (!isEmpty(res.data)) {
        progressList.value = res.data.progressList || []
        progressName.value = progress[res.data.progress] || ''
        name.value = res.data.name || ''
    }
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
                z-index: 1;
            }
            &:last-child {
                &::after {
                    content: '';
                    position: absolute;
                    left: -42px;
                    top: 14px;
                    background-color: white;
                    width: 20px;
                    height: 100px;
                }
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
