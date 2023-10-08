<template>
    <div class="list-page">
        <NavBar title="客户列表" :style="{ paddingLeft: `15px` }" />
        <div :class="`body-container list-page__body ${isEmpty ? 'empty' : ''}`">
            <div v-if="isEmpty" class="customer-wrap">
                <div class="flex justify-center mb-20px">
                    <VanImage :src="listEmpty" class="empty-png" />
                </div>
                <div class="flex justify-center">
                    <VanButton block type="info" native-type="button" class="submit-button" @click="addBusiness"
                        >新增业务申请</VanButton
                    >
                </div>
            </div>
            <div v-else class="flex flex-1 customer-section">
                <div class="flex flex-col flex-1 customer-wrap">
                    <div class="customer-header">
                        <span class="flex items-center customer-filter"
                            >点击筛选客户列表<i class="ml-7px customer-filter__icon"></i
                        ></span>
                    </div>
                    <div class="flex-1 customer-refresh">
                        <PullRefresh v-model="isLoading" @refresh="onRefresh" class="h-full">
                            <ul class="customer-list">
                                <li class="customer-item green">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">业务申请：等待提交 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >删除</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item green">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">业务申请：等待提交 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看进度</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >联系负责人</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item red">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">业务申请：驳回 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                        <div class="customer-item__row">
                                            <div class="reject-info">
                                                <p>您的业务申请需要调整，请根据以下给出建议调整后重新提交：</p>
                                                <p>1、</p>
                                                <p>2、</p>
                                                <p>3、</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看进度</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >联系负责人</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item green">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">业务申请：等待确认 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看进度</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >联系负责人</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item green">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">业务申请：等待签署 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看进度</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >联系负责人</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看协议</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item green">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">业务申请：等待签署 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                        <div class="customer-item__row">
                                            <div class="flex items-center justify-between sign-info">
                                                请提醒客户尽快签署协议
                                                <span>></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看进度</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >联系负责人</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看协议</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item red">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">业务申请：重新签署 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                        <div class="customer-item__row">
                                            <div class="flex items-center justify-between sign-info">
                                                请提醒客户尽快签署协议
                                                <span>></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看进度</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >联系负责人</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看协议</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item green">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A</h4>
                                        <span class="customer-item__status">发货流程：等待发货 ></span>
                                    </div>
                                    <div class="customer-item__body">
                                        <div class="customer-item__row">行业类型：金融</div>
                                        <div class="customer-item__row">法定代表人：张三（18812345678）</div>
                                    </div>
                                    <div class="flex items-center customer-item__footer">
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看进度</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >联系负责人</VanButton
                                        >
                                        <VanButton block type="info" native-type="button" class="customer-item__button"
                                            >查看协议</VanButton
                                        >
                                    </div>
                                </li>
                            </ul>
                        </PullRefresh>
                    </div>
                </div>
                <div class="submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button" @click="addBusiness"
                        >新增业务申请</VanButton
                    >
                </div>
            </div>
        </div>
        <Popup v-model="show" position="top" :style="{ height: '30%' }" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { NavBar, Popup, PullRefresh, Image as VanImage } from 'vant'
import router from '@/router'

import listEmpty from '@/assets/img/list-empty.png'

const instance = getCurrentInstance()
const { $toast } = instance.proxy

const isEmpty = ref(true)
const show = ref(false)
const isLoading = ref(false)
const dataSet = reactive({
    list: []
})

// 新增业务申请
const addBusiness = () => {
    router.push({ name: 'Disclaimer' })
}

const onRefresh = () => {
    setTimeout(() => {
        $toast('刷新成功')
        isLoading.value = false
    }, 1000)
}

onMounted(() => {
    isEmpty.value = false
})
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.list-page {
    &__body {
        &.empty {
            margin-top: 75px;
        }
    }
    .empty-png {
        height: 223px;
    }
    .submit-button {
        width: 310px;
    }
    .customer-section {
        background-color: #fbfbfb;
        padding: 24px 14px;
    }
    .customer-header {
        margin-bottom: 20px;
    }
    .customer-filter {
        color: #ff5f01;
        font-size: 14px;
        line-height: 14px;
        &__icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url('~@/assets/icon/filter-list-icon.png') no-repeat top / cover;
            transform: scale(0.5);
            transform-origin: left center;
        }
    }
    .customer-item {
        font-size: 14px;
        margin-bottom: 15px;
        border-radius: 10px;
        background-color: white;
        color: #2a314d;
        padding: 15px;
        &:last-child {
            margin-bottom: 0;
        }
        &.green {
            .customer-item__status {
                color: #64c645;
            }
        }
        &.red {
            .customer-item__status {
                color: #ff5f01;
            }
        }
        &__header {
            padding-bottom: 15px;
            @include border-1px(bottom, #e5e5e5);
        }
        &__body {
            padding: 15px 0;
            .customer-item__row {
                padding-bottom: 15px;
                &:last-child {
                    padding-bottom: 0;
                }
            }
        }
        &__footer {
            button {
                width: 78px;
                margin-right: 10px;
                background-color: #ff5f01;
                border-radius: 4px;
                padding: 0;
                height: 28px;
                line-height: 28px;
                border: 0;
                outline: none;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        &__row {
            line-height: 14px;
        }
        .reject-info {
            background-color: #f3f7ff;
            border-radius: 5px;
            font-size: 13px;
            line-height: 18px;
            color: #2a314d;
            padding: 15px;
        }
        .sign-info {
            margin-bottom: 7px;
            padding: 15px 12px;
            border-radius: 5px;
            background-color: #fff4ee;
            font-size: 14px;
            line-height: 14px;
            color: #ff5f01;
        }
    }
}
</style>
