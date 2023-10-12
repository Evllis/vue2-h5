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
                        <span class="flex items-center customer-filter" @click="show = true"
                            >点击筛选客户列表<i
                                class="ml-7px transform origin-center scale-50 customer-filter__icon"
                            ></i
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
                                        <VanButton
                                            block
                                            type="info"
                                            native-type="button"
                                            class="customer-item__button"
                                            @click="removeBusiness"
                                            >删除</VanButton
                                        >
                                    </div>
                                </li>
                                <li class="customer-item green">
                                    <div class="flex justify-between customer-item__header">
                                        <h4 class="customer-item__title">企业名称A11111111</h4>
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
                                        <VanButton
                                            block
                                            type="info"
                                            native-type="button"
                                            class="customer-item__button"
                                            @click="contactPerson"
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
        <Popup
            v-model="show"
            position="top"
            round
            :style="{ top: '12.2667vw' }"
            get-container="#app"
            @closed="resetFormData"
        >
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <Field
                        v-model="formData.data.name"
                        :rules="rules.name"
                        name="name"
                        label="企业名称"
                        placeholder="请输入您的企业名称"
                    />
                    <Field
                        v-model="formData.data.industryType"
                        :right-icon="inactiveIcon"
                        :rules="rules.industryType"
                        name="industryType"
                        label="行业类型"
                        placeholder="请选择行业类型"
                        class="select-cell"
                    >
                        <template #input>
                            <div id="drop-container" class="drop-container">
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="formData.data.industryType"
                                        :options="columns"
                                        get-container="#drop-container"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.progress"
                        :right-icon="inactiveIcon"
                        :rules="rules.progress"
                        name="industryType"
                        label="业务进度"
                        placeholder="请选择业务进度"
                        class="select-cell"
                    >
                        <template #input>
                            <div id="drop-container" class="drop-container">
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="formData.data.progress"
                                        :options="progressColumns"
                                        get-container="#drop-container"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.status"
                        :right-icon="inactiveIcon"
                        :rules="rules.status"
                        name="industryType"
                        label="业务状态"
                        placeholder="请选择业务状态"
                        class="select-cell"
                    >
                        <template #input>
                            <div id="drop-container" class="drop-container">
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="formData.data.status"
                                        :options="statusColumns"
                                        get-container="#drop-container"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </template>
                    </Field>
                </div>
                <div class="flex items-center justify-center mb-30px">
                    <VanButton
                        block
                        type="info"
                        native-type="button"
                        class="w-150px mr-20px submit-button"
                        @click="resetFormData"
                        >重置</VanButton
                    >
                    <VanButton block type="info" native-type="submit" class="w-150px submit-button">查询</VanButton>
                </div>
                <div class="flex justify-center mb-25px">
                    <span class="flex items-center customer-filter" @click="show = false"
                        >点击筛选客户列表<i
                            class="ml-7px transform rotate-180 origin-center scale-50 customer-filter__icon"
                        ></i
                    ></span>
                </div>
            </Form>
        </Popup>
        <VanDialog
            v-model="dialogShow"
            class="base-dialog"
            title=""
            show-cancel-button
            confirm-button-text="删除"
            cancel-button-text="取消"
            :beforeClose="dialogClose"
        >
            <div>
                <p>该业务申请删除，不可恢复!</p>
            </div>
        </VanDialog>
        <ActionSheet
            v-model="actionShow"
            :actions="actions.data"
            :closeable="false"
            :title="actionTitle"
            cancel-text="取消"
            close-on-click-action
            @cancel="actionCancel"
            @select="actionSelect"
        />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import {
    NavBar,
    Popup,
    PullRefresh,
    Form,
    Field,
    DropdownMenu,
    DropdownItem,
    ActionSheet,
    Image as VanImage
} from 'vant'
import { nonCharacter } from '@/utils/validate'
import router from '@/router'
import { getEnterpriseList } from '@/api/customer'
import { useCache } from '@/hooks/useCache'

import listEmpty from '@/assets/img/list-empty.png'
import inactiveIcon from '@/assets/icon/select-icon.png'

const instance = getCurrentInstance()
const { wsCache } = useCache()
const { $toast } = instance.proxy

// 动作面板
const actionShow = ref(false)
const actionTitle = ref('张三 18722448877')
const actions = reactive({
    data: [{ name: '呼叫', value: 18722448877 }]
})
const actionCancel = () => {
    console.log('22222222')
}
const contactPerson = () => {
    actionShow.value = true
}
const actionSelect = (action, index) => {
    console.log(action, index)
    window.location.href = 'tel://18755446688'
}

const customerId = ref('')
const isEmpty = ref(true)
const dialogShow = ref(false)
const show = ref(false)
const isLoading = ref(false)
const dataSet = reactive({
    list: []
})
const formData = reactive({
    data: {
        name: '',
        industryType: '0',
        progress: '0',
        status: '0'
    }
})
const rules = reactive({
    name: [
        { required: true, message: '请填写企业名称' },
        { pattern: /^.{2,50}$/, message: '长度必须是2-50位' },
        { validator: nonCharacter, message: '请输入正确的企业名称' }
    ],
    industryType: [{ required: true, message: '请选择行业类型' }],
    progress: [{ required: true, message: '请选择业务进度' }],
    status: [{ required: true, message: '请选择业务状态' }]
})
const formRef = ref()
const columns = ref([
    { text: '全部', value: '0' },
    { text: '建筑业', value: '1' },
    { text: '制造业', value: '2' },
    { text: '交通运输、仓储业和邮政业', value: '3' },
    { text: '信息传输、计算机服务和软件业', value: '4' },
    { text: '批发和零售业', value: '5' },
    { text: '住宿、餐饮业', value: '6' },
    { text: '金融、保险业', value: '7' },
    { text: '房地产业', value: '8' },
    { text: '租赁和商务服务业', value: '9' },
    { text: '教育、培训', value: '10' },
    { text: '文化、体育、娱乐业', value: '11' },
    { text: '其它', value: '12' }
])
const progressColumns = ref([
    { text: '全部', value: '0' },
    { text: '资质审核', value: '2' },
    { text: '协议签署', value: '3' },
    { text: '发货流程', value: '4' }
])
const statusColumns = ref([
    { text: '全部', value: '0' },
    { text: '未提交', value: '1' },
    { text: '资质审核中', value: '2' },
    { text: '资质驳回', value: '3' },
    { text: '资质拒绝', value: '4' },
    { text: '等待确认', value: '5' },
    { text: '协议待签署', value: '6' },
    { text: '等待发货', value: '9' },
    { text: '已发货', value: '10' }
])

const onSubmit = async () => {
    formRef.value
        .validate()
        .then(async () => {
            console.log(232222, formData.data)
        })
        .catch(() => {})
}

const resetFormData = () => {
    formData.data = {
        name: '',
        industryType: '0',
        progress: '0',
        status: '0',
        currentPage: 1,
        pageSize: 10
    }
}

const dialogClose = (action, done) => {
    if (action === 'confirm') {
        console.log(44444444)
    }
    done()
}

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

const getEnterpriseListAccess = async () => {
    customerId.value = wsCache.get('customerId') || ''
    const res = await getEnterpriseList({
        data: {
            customerId: customerId.value,
            ...formData.data
        }
    })
    console.log(5555555, res)
    if (!isEmpty(res)) {
        console.log(3333333)
    }
}

// 删除业务
const removeBusiness = () => {
    dialogShow.value = true
    console.log('删除业务')
}

onMounted(() => {
    isEmpty.value = false
    // getEnterpriseListAccess()
})
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.list-page {
    & > :deep(.van-overlay) {
        z-index: 4000 !important;
    }
    & > .base-dialog,
    & > .van-popup {
        z-index: 4001 !important;
    }
    & > .van-popup {
        .van-action-sheet__header {
            @include border-1px(bottom, #e5e5e5);
            height: 53px;
            line-height: 53px;
        }
    }
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
.customer-filter {
    color: #ff5f01;
    font-size: 14px;
    line-height: 14px;
    &__icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('~@/assets/icon/filter-list-icon.png') no-repeat top / cover;
        margin-left: 4px;
    }
}
:deep(.drop-container .van-popup) {
    max-height: 240px;
    border: 1px solid #e5e5e5;
    &::after {
        display: none;
    }
}
:deep(.base-dialog) {
    .van-dialog__content {
        font-size: 14px;
        padding: 36px 0;
        text-align: center;
    }
    .van-dialog__footer {
        padding: 0 20px 25px 20px;
        &::after {
            display: none;
        }
        button {
            font-size: 15px;
            height: 43px;
            border-radius: 6px;
            &:first-child {
                border: 1px solid #ff5f01;
                color: #ff5f01;
            }
            &:last-child {
                margin-left: 10px;
                background-color: #ff5f01;
                color: white;
                &::after {
                    display: none;
                }
            }
        }
    }
}
</style>
<style lang="scss">
#app > .van-overlay {
    top: 12.2667vw;
}
</style>
