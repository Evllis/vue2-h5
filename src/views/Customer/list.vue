<template>
    <div class="list-page">
        <NavBar title="客户列表" :style="{ paddingLeft: `15px` }" />
        <div :class="`body-container list-page__body ${!dataSet.list.length && !isList ? 'empty' : ''}`">
            <div v-if="!dataSet.list.length && !isList" class="customer-wrap">
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
                        <div v-if="skeletonLoading">
                            <Skeleton title :row="3" class="mb-30px" />
                            <Skeleton title :row="3" class="mb-30px" />
                            <Skeleton title :row="3" class="mb-30px" />
                            <Skeleton title :row="3" />
                        </div>
                        <div v-else>
                            <PullRefresh v-model="isLoading" @refresh="onRefresh" class="h-full">
                                <ul class="customer-list">
                                    <List
                                        v-model="dataSet.loading"
                                        :finished="dataSet.finished"
                                        finished-text="没有更多了"
                                        @load="getEnterpriseListAccess"
                                    >
                                        <li
                                            v-for="item in dataSet.list"
                                            :key="item.enterpriseId"
                                            :class="`customer-item ${filterColorItem(item.status)}`"
                                        >
                                            <div
                                                class="flex justify-between customer-item__header"
                                                @click="previewInfo(item)"
                                            >
                                                <h4 class="customer-item__title">{{ item.name }}</h4>
                                                <span class="customer-item__status">
                                                    <span v-if="[9, 10].indexOf(item.status) !== -1">发货流程:</span>
                                                    <span v-else-if="[8, 6, 5].indexOf(item.status) !== -1"
                                                        >协议签署:</span
                                                    >
                                                    <span v-else-if="item.status !== 11">业务申请:</span>
                                                    {{ filterStatusItem(item)[0].text }} <Icon name="arrow" size="12" />
                                                </span>
                                            </div>
                                            <div class="customer-item__body">
                                                <div class="customer-item__row">
                                                    行业类型：{{ filterIndustryItem(item)[0].text }}
                                                </div>
                                                <div v-if="item.corporateName" class="customer-item__row">
                                                    法定代表人：{{ item.corporateName }}
                                                </div>
                                                <div v-if="item.corporatePhone" class="customer-item__row">
                                                    法人联系方式：{{ item.corporatePhone }}
                                                </div>
                                                <div v-if="item.status === 10" class="customer-item__row">
                                                    <div
                                                        class="flex items-center justify-between sign-info"
                                                        @click="uploadSign(item)"
                                                    >
                                                        请上传签收确认单
                                                        <Icon name="arrow" size="12" />
                                                    </div>
                                                </div>
                                                <div v-else-if="item.status === 8" class="customer-item__row">
                                                    <div class="reject-info">
                                                        <p>协议有误，我们将尽快与您联系重新确认协议内容！</p>
                                                    </div>
                                                </div>
                                                <div v-else-if="item.status === 6" class="customer-item__row">
                                                    <div
                                                        class="flex items-center justify-between sign-info"
                                                        @click="previewSign(item)"
                                                    >
                                                        请提醒客户尽快签署协议！
                                                        <Icon name="arrow" size="12" />
                                                    </div>
                                                </div>
                                                <div v-else-if="item.status === 4" class="customer-item__row">
                                                    <div class="reject-info">
                                                        <p>您的业务申请不符合我司标准，原因如下，敬请谅解！</p>
                                                        <p style="color: #ff5f01" class="mt-10px">
                                                            {{ item.auditMsg }}
                                                        </p>
                                                        <p style="color: #ff5f01" class="mt-10px">
                                                            {{ item.auditExpireTime }}后可重新提交
                                                        </p>
                                                    </div>
                                                </div>
                                                <div v-else-if="item.status === 3" class="customer-item__row">
                                                    <div class="reject-info">
                                                        <p>请根据以下给出建议调整后重新提交：</p>
                                                        <p
                                                            v-for="(v, index) in item.auditList"
                                                            :key="v.step"
                                                            class="flex items-center justify-between mt-10px"
                                                        >
                                                            {{ index + 1 }}、{{ v.msg }}
                                                            <span @click="modifyStep(v, item)" style="color: #ff5f01"
                                                                >去处理<Icon name="arrow" size="12"
                                                            /></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center customer-item__footer">
                                                <VanButton
                                                    block
                                                    type="info"
                                                    native-type="button"
                                                    class="customer-item__button"
                                                    @click="removeBusiness(item)"
                                                    v-if="item.status === 1"
                                                    >删除</VanButton
                                                >
                                                <VanButton
                                                    block
                                                    type="info"
                                                    native-type="button"
                                                    class="customer-item__button"
                                                    @click="previewProcess(item)"
                                                    v-if="item.status !== 1"
                                                    >查看进度</VanButton
                                                >
                                                <VanButton
                                                    block
                                                    type="info"
                                                    native-type="button"
                                                    class="customer-item__button"
                                                    @click="contactPerson(item)"
                                                    v-if="item.status !== 1"
                                                    >联系负责人</VanButton
                                                >
                                                <VanButton
                                                    block
                                                    type="info"
                                                    native-type="button"
                                                    class="customer-item__button"
                                                    @click="previewSign(item, true)"
                                                    v-if="[6, 7, 8, 9, 10, 11].indexOf(item.status) !== -1"
                                                    >查看协议</VanButton
                                                >
                                                <VanButton
                                                    block
                                                    type="info"
                                                    native-type="button"
                                                    class="customer-item__button"
                                                    @click="reapplySign(item)"
                                                    v-if="item.status === 3"
                                                    >重新申请</VanButton
                                                >
                                            </div>
                                        </li>
                                    </List>
                                </ul>
                            </PullRefresh>
                        </div>
                    </div>
                </div>
                <div class="submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button" @click="addBusiness"
                        >新增业务申请</VanButton
                    >
                </div>
            </div>
        </div>
        <Popup v-model="show" position="top" round :style="{ top: '12.2667vw' }" get-container="#app">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <Field
                        v-model="formData.data.name"
                        :rules="rules.name"
                        name="name"
                        label="企业名称"
                        placeholder="请输入客户的企业名称"
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
                                        :disabled="formData.data.progress === '0'"
                                        :options="filterStatusColumns"
                                        get-container="#drop-container"
                                    ></DropdownItem>
                                </DropdownMenu>
                                <div
                                    v-show="formData.data.progress === '0'"
                                    class="dropdownItem"
                                    @click="statusOpen"
                                ></div>
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
                    <VanButton
                        block
                        type="info"
                        native-type="submit"
                        :loading="submitLoading"
                        class="w-150px submit-button"
                        loading-text="加载中..."
                        >查询</VanButton
                    >
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
import { ref, reactive, onMounted, onActivated, getCurrentInstance, watch } from 'vue'
import {
    NavBar,
    Popup,
    PullRefresh,
    Form,
    Field,
    DropdownMenu,
    DropdownItem,
    ActionSheet,
    List,
    Icon,
    Skeleton,
    Toast,
    Image as VanImage
} from 'vant'
import { nonCharacter } from '@/utils/validate'
import router from '@/router'
import { getEnterpriseList, getContractInfo, delEnterprise } from '@/api/customer'
import { auditStatusFourSubmit } from '@/api/audit'
import { auditMap } from '@/store/config'
import { isEmpty } from 'lodash-es'

import listEmpty from '@/assets/img/list-empty.png'
import inactiveIcon from '@/assets/icon/select-icon.png'

const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

// 第一次进入时，是否有业务列表数据
const isList = ref(false)
// 动作面板
const actionShow = ref(false)
const actionTitle = ref('')
const actions = reactive({
    data: [{ name: '呼叫', value: null }]
})
const actionCancel = () => {
    console.log('取消呼叫')
}
// 联系负责人
const contactPerson = item => {
    actionTitle.value = `${item.operateName} ${item.operatePhone}`
    actions.data[0].value = item.operatePhone
    actionShow.value = true
}
const actionSelect = action => {
    window.location.href = `tel://${action.value}`
}

// 驳回修改
const modifyStep = async (v, item) => {
    // 审核驳回的步骤：1-企业基本信息 2-企业经办人信息 3-门头社保信息 4-与联通合作信息 5-入网清单 6-采购清单 7-合同预填写 8-协议预览
    await $store.commit('app/BATCH_SETTINGS', {
        editAudit: true,
        enterpriseId: item.enterpriseId,
        isPreview: false,
        status: item.status
    })
    router.push({
        name: auditMap.value[v.step]
    })
}

// 协议预览
const previewSign = async (item, isPreview) => {
    $toast.loading({
        message: '正在加载...',
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner'
    })
    const enterpriseId = item.enterpriseId
    const res = await getContractInfo({
        data: {
            enterpriseId
        }
    })
    if (!isEmpty(res.data)) {
        $toast.clear()
        // 查看协议时, 如果状态为等待签署6, 则显示分享给客户按钮
        $store.commit('sign/SET_SIGN_SUCCESS', item.status !== 6 && isPreview ? '1' : '')
        $store.commit('SET_SOURCE', 'List')
        $store.commit('app/BATCH_SETTINGS', {
            enterpriseId: res.data.enterpriseId,
            enterpriseName: item.name
        })
        $store.commit('sign/BATCH_SETTINGS', {
            linkUrl: encodeURIComponent(res.data.linkUrl),
            contractCode: res.data.contractCode,
            pdfUrl: res.data.contractUrl
        })
        router.push('/sign')
    }
}

const currentItem = ref({})
const customerId = ref('')
const dialogShow = ref(false)
const show = ref(false)
const submitLoading = ref(false)
const skeletonLoading = ref(true)
const isLoading = ref(false)
const dataSet = reactive({
    list: [],
    currentPage: 0,
    pageSize: 10,
    loading: false,
    finished: false
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
        // { required: true, message: '请填写企业名称' },
        {
            validator: () => {
                if (formData.data.name && !/^.{2,50}$/.test(formData.data.name)) {
                    return false
                }
                return true
            },
            message: '长度必须是2-50位'
        },
        {
            validator: () => {
                if (formData.data.name && !nonCharacter(formData.data.name)) {
                    return false
                }
                return true
            },
            message: '请输入正确的企业名称'
        }
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
    { text: '业务申请', value: '2' },
    { text: '协议签署', value: '3' },
    { text: '发货流程', value: '4' }
])
const filterStatusColumns = ref([])
const statusColumns = ref([
    { text: '全部', value: '0' },
    { text: '等待提交', value: '1' },
    { text: '等待审核', value: '2' },
    { text: '驳回', value: '3' },
    { text: '拒绝', value: '4' },
    { text: '等待确认', value: '5' },
    { text: '等待签署', value: '6' },
    { text: '等待发货', value: '9' },
    { text: '已发货', value: '10' },
    { text: '已完成', value: '11' }
])
const statusItems = ref([
    { text: '等待提交', value: '1' },
    { text: '等待审核', value: '2' },
    { text: '驳回', value: '3' },
    { text: '拒绝', value: '4' },
    { text: '等待确认', value: '5' },
    { text: '等待签署', value: '6' },
    { text: '等待发货', value: '7' },
    { text: '等待确认', value: '8' },
    { text: '等待发货', value: '9' },
    { text: '已发货', value: '10' },
    { text: '已完成', value: '11' }
])

const onSubmit = async () => {
    submitLoading.value = true
    formRef.value
        .validate()
        .then(async () => {
            dataSet.list.length = 0
            dataSet.finished = false
            dataSet.loading = true
            dataSet.currentPage = 0
            await getEnterpriseListAccess()
            show.value = false
            submitLoading.value = false
        })
        .catch(() => {
            submitLoading.value = false
        })
}

const resetFormData = () => {
    formRef.value.resetValidation()
    formData.data = {
        name: '',
        industryType: '0',
        progress: '0',
        status: '0'
    }
}

const dialogClose = async (action, done) => {
    if (action === 'confirm') {
        const res = await delEnterprise({
            data: {
                enterpriseId: currentItem.value.enterpriseId
            },
            hideloading: true
        })
        if (res.returnCode === '1000') {
            $toast.success({
                message: '删除成功'
            })
            onRefresh(false)
        } else {
            $toast.success({
                message: '删除失败'
            })
        }
    }
    done()
}

// 新增业务申请
const addBusiness = () => {
    $store.commit('app/BATCH_SETTINGS', {
        editAudit: false,
        isPreview: false,
        status: 0
    })
    router.push({ name: 'Disclaimer' })
}

// 筛选业务状态打开时
const statusOpen = () => {
    Toast('请先选择业务进度')
}

// 上传签收单
const uploadSign = async item => {
    $store.commit('app/BATCH_SETTINGS', { enterpriseId: item.enterpriseId, enterpriseName: item.name })
    router.push({
        name: 'Confirm'
    })
}

const onRefresh = async (isRefresh = true) => {
    dataSet.list.length = 0
    dataSet.finished = false
    dataSet.loading = true
    dataSet.currentPage = 0
    await getEnterpriseListAccess()
    if (isRefresh) $toast('刷新成功')
    isLoading.value = false
}

const getEnterpriseListAccess = async isInit => {
    if (dataSet.finished) return false
    if (!dataSet.currentPage) skeletonLoading.value = true
    dataSet.currentPage++
    try {
        const res = await getEnterpriseList({
            data: {
                customerId: customerId.value,
                currentPage: dataSet.currentPage,
                pageSize: dataSet.pageSize,
                ...formData.data
            },
            hideloading: true
        })
        if (!isEmpty(res.data)) {
            if (isInit && res.data.enterpriseList.length) isList.value = true
            dataSet.list = [...dataSet.list, ...res.data.enterpriseList]
            dataSet.loading = false
            if (res.data.enterpriseList.length < 5 || dataSet.list.length === res.data.total) {
                dataSet.finished = true
            }
            if (dataSet.currentPage === 1) setTimeout(() => (skeletonLoading.value = false), 500)
        }
    } catch (err) {
        if (dataSet.currentPage) {
            dataSet.currentPage--
        }
        return false
    }
}

// 删除业务
const removeBusiness = item => {
    dialogShow.value = true
    currentItem.value = item
}

// 状态驳回重新申请
const reapplySign = async item => {
    try {
        await auditStatusFourSubmit({
            data: {
                enterpriseId: item.enterpriseId
            }
        })
        $toast.success({
            message: '申请成功',
            onClose: () => {
                item.status = 2
            }
        })
    } catch (err) {
        $toast.fail('申请失败，请重试')
        return false
    }
}

// 查看企业信息
const previewInfo = item => {
    $store.commit('app/BATCH_SETTINGS', {
        enterpriseId: item.enterpriseId,
        status: item.status
    })
    $store.commit('app/SET_IS_PREVIEW', item.status === 1 ? false : true)
    router.push({ name: 'Enterprise' })
}

const filterStatusItem = item => statusItems.value.filter(v => v.value === `${item.status}`)
const filterIndustryItem = item => columns.value.filter(v => v.value === `${item.industryType}`)
const filterColorItem = status => {
    let color = 'green'
    if ([3, 4].indexOf(status) !== -1) color = 'red'
    else if ([11].indexOf(status) !== -1) color = ''
    return color
}

// 查看进度
const previewProcess = async item => {
    $store.commit('app/SET_ENTERPRISE_ID', item.enterpriseId)
    router.push({ name: 'Process' })
}

watch(
    () => formData.data.progress,
    n => {
        // 默认全部
        let keys = ['0', '1', '2', '3', '4', '5', '6', '9', '10', '11']
        // 业务申请
        if (n === '2') keys = ['0', '1', '2', '3', '4']
        // 协议签署
        if (n === '3') keys = ['0', '5', '6']
        // 发货流程
        if (n === '4') keys = ['0', '9', '10', '11']
        filterStatusColumns.value = statusColumns.value.filter(v => keys.indexOf(v.value) !== -1)
        formData.data.status = filterStatusColumns.value[0].value
    },
    { deep: true, immediate: true }
)

onMounted(() => {
    const isRefresh = router.history.current.params.isRefresh
    customerId.value = $store.getters['customerId'] || ''
    if (!isRefresh) {
        getEnterpriseListAccess(true)
    }
})

onActivated(() => {
    // 如果签收确认单上传完成，则返回列表页刷新状态
    const confirmId = router.history.current.params.confirmId
    const isRefresh = router.history.current.params.isRefresh
    if (confirmId) {
        dataSet.list = dataSet.list.map(v => {
            if (v.enterpriseId === confirmId) {
                v.status = 11
            }
            return v
        })
    }
    if (isRefresh) {
        onRefresh(false)
    }
})
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.list-page {
    .van-skeleton__row,
    .van-skeleton__title {
        background-color: #ececec;
    }
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
        width: 223px;
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
        &__title {
            max-width: 160px;
            @include textoverflow();
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
.dropdownItem {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
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
