<template>
    <div class="network-page">
        <NavBar
            title="合同预填写"
            :left-arrow="!editAudit"
            @click-left="onClickLeft"
            :right-text="list.data.arr.length ? '新增' : ''"
            @click-right="addItem"
            :style="{ paddingLeft: `${editAudit ? '15px' : ''}` }"
        />
        <div class="body-container network-page__body pt-25px">
            <div class="van-form">
                <div class="form-wrap">
                    <h3 class="fs-13 mb-20px">采购清单</h3>
                    <ul class="package-list">
                        <List
                            v-model="list.data.loading"
                            :finished="list.data.finished"
                            finished-text="没有更多了"
                            @load="findBuyListAccess"
                        >
                            <li v-for="item in list.data.arr" :key="item.id" class="package-item">
                                <div class="flex items-center package-body">
                                    <div class="flex-1 flex flex-col package-wrap">
                                        <div class="flex package-info">
                                            <span class="truncate max-w-100px">{{ item.brand }}</span>
                                            <span class="truncate max-w-100px">{{ item.dispose }}</span>
                                        </div>
                                        <div class="flex text-[var(--primary-active-color)]">
                                            <span class="truncate max-w-80px">共{{ item.count }}台</span>
                                            <span class="truncate max-w-150px"
                                                >月支付金额{{ item.monthlyPayment }}元/台</span
                                            >
                                        </div>
                                    </div>
                                    <div class="package-opts">
                                        <VanButton
                                            plain
                                            type="primary"
                                            native-type="button"
                                            color="var(--primary-active-color)"
                                            @click="editItem(item)"
                                            >编辑</VanButton
                                        >
                                    </div>
                                </div>
                            </li>
                        </List>
                    </ul>
                </div>
                <div class="flex submit-footer">
                    <div v-if="!editAudit" class="flex flex-1">
                        <VanButton
                            block
                            type="info"
                            native-type="button"
                            class="submit-button mr-10px"
                            to="/network/home"
                            >上一步</VanButton
                        >
                        <template v-if="list.data.arr.length">
                            <VanButton
                                block
                                type="info"
                                native-type="button"
                                class="submit-button"
                                @touchstart="submitFormData"
                                >下一步</VanButton
                            >
                        </template>
                        <template v-else>
                            <VanButton block type="info" native-type="button" class="submit-button" @click="addItem"
                                >新增采购信息</VanButton
                            >
                        </template>
                    </div>
                    <div v-else class="flex flex-1">
                        <VanButton
                            block
                            type="info"
                            native-type="button"
                            class="submit-button"
                            @touchstart="submitFormData"
                            >提交</VanButton
                        >
                    </div>
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app" class="custom">
                    <VanIcon name="cross" class="close-icon" @click="showPicker = false" />
                    <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                        <Field
                            v-model="packageData.data.period"
                            :right-icon="inactiveIcon"
                            :rules="rules.period"
                            name="period"
                            label="合约期"
                            placeholder="请输入合约期"
                            class="select-cell"
                        >
                            <template #input>
                                <div id="period" class="drop-container">
                                    <DropdownMenu>
                                        <DropdownItem
                                            v-model="packageData.data.period"
                                            :options="columns"
                                            get-container="#period"
                                        ></DropdownItem>
                                    </DropdownMenu>
                                </div>
                            </template>
                        </Field>
                        <Field
                            v-model="packageData.data.category"
                            :right-icon="inactiveIcon"
                            :rules="rules.category"
                            name="category"
                            label="品类"
                            placeholder="请选择品类"
                            class="select-cell"
                        >
                            <template #input>
                                <div id="category" class="drop-container">
                                    <DropdownMenu>
                                        <DropdownItem
                                            v-model="packageData.data.category"
                                            :options="categoryColumns"
                                            get-container="#category"
                                        ></DropdownItem>
                                    </DropdownMenu>
                                </div>
                            </template>
                        </Field>
                        <Field
                            v-model="packageData.data.brand"
                            name="brand"
                            label="品牌/型号"
                            placeholder="请输入品牌/型号"
                            :rules="rules.brand"
                        />
                        <Field
                            v-model="packageData.data.dispose"
                            name="dispose"
                            label="配置"
                            placeholder="请输入配置"
                            :rules="rules.dispose"
                        />
                        <Field
                            v-model="packageData.data.count"
                            name="count"
                            type="digit"
                            label="数量"
                            placeholder="请输入数量"
                            :rules="rules.count"
                            :formatter="formatterMax"
                        />
                        <Field
                            v-model="packageData.data.monthlyPayment"
                            type="number"
                            name="monthlyPayment"
                            label="月支付金额(元/台)"
                            placeholder="请输入月支付金额(元/台)"
                            :rules="rules.monthlyPayment"
                            :formatter="formatterNumber"
                        />
                        <div class="shadow-none p-0 submit-footer">
                            <VanButton block type="info" native-type="submit" class="submit-button">{{
                                addType === 'add' ? '确定' : '提交'
                            }}</VanButton>
                        </div>
                    </Form>
                </Popup>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, List, DropdownMenu, DropdownItem } from 'vant'
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { isEmpty } from 'lodash-es'
import { formatterNumber } from '@/utils'
import { useCache } from '@/hooks/useCache'
import router from '@/router'

import { updateStep } from '@/api/common'
import { findBuyList, editBuy } from '@/api/procurement'

import inactiveIcon from '@/assets/icon/select-icon.png'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const columns = ref([
    { text: '12', value: '12' },
    { text: '24', value: '24' },
    { text: '30', value: '30' },
    { text: '36', value: '36' }
])
const categoryColumns = ref([
    { text: '手机', value: '1' },
    { text: '平板电脑', value: '2' },
    { text: 'TV终端', value: '3' },
    { text: '路由', value: '4' },
    { text: '智能家居', value: '5' },
    { text: '监控设备', value: '6' },
    { text: '耳机', value: '7' },
    { text: '其它', value: '8' }
])
const formRef = ref()
const currentPage = ref(0)
const packageData = reactive({
    data: {
        period: '', // 合约期
        category: '', // 品类：1  手机 2  平板电脑 3  TV终端 4  路由 5  智能家居 6  监控设备 7  耳机 8  其它
        brand: '', // 品牌/型号
        dispose: '', // 配置
        count: '', // 数量
        monthlyPayment: '' // 月支付金额(元)
    }
})
const rules = reactive({
    period: [{ required: true, message: '请选择合约期' }],
    category: [{ required: true, message: '请选择品类' }],
    brand: [{ required: true, message: '请填写品牌/型号' }],
    dispose: [{ required: true, message: '请填写配置' }],
    count: [{ required: true, message: '请填写数量' }],
    monthlyPayment: [{ required: true, message: '请填写月支付金额' }]
})
const list = reactive({
    data: {
        loading: false,
        finished: false,
        arr: []
    }
})
const showPicker = ref(false)
const addType = ref('add')
const buyId = ref('')
const socialSecurityNumber = ref(0)
const editAudit = ref(false)

const popupClosed = () => {
    for (const i in packageData.data) {
        packageData.data[i] = ''
    }
}

const formatterMax = val => {
    if (+val > socialSecurityNumber.value) {
        return socialSecurityNumber.value
    }
    return val
}

const onClickLeft = () => {
    router.push({ name: 'Network' })
}

const addItem = () => {
    addType.value = 'add'
    buyId.value = ''
    popupClosed()
    showPicker.value = true
}

// 编辑单项
const editItem = item => {
    addType.value = 'edit'
    showPicker.value = true
    packageData.data = {
        period: item.period,
        category: item.category,
        brand: item.brand,
        dispose: item.dispose,
        count: item.count,
        monthlyPayment: item.monthlyPayment
    }
    buyId.value = item.id
}

const onSubmit = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        packageData.data['enterpriseId'] = enterpriseId
        if (buyId.value) {
            packageData.data['buyId'] = buyId.value
        }
        formRef.value
            .validate()
            .then(async () => {
                try {
                    await editBuy({
                        data: packageData.data
                    })
                    showPicker.value = false
                    popupClosed()
                    list.data.arr.length = 0
                    currentPage.value = 0
                    list.data.finished = false
                    await findBuyListAccess()
                } catch (err) {
                    return false
                }
            })
            .catch(() => {})
    } else {
        $toast.fail({
            message: '请重新登录',
            onClose: () => {
                router.push({ name: 'Login' })
            }
        })
    }
}

const submitFormData = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    try {
        await updateStep({
            data: {
                enterpriseId: enterpriseId || '',
                step: '6'
            }
        })
        router.push({ name: !editAudit.value ? 'Receipt' : 'Audit' })
    } catch (err) {
        return false
    }
}

const findBuyListAccess = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    currentPage.value++
    try {
        const res = await findBuyList({
            data: {
                enterpriseId: enterpriseId,
                currentPage: currentPage.value
            },
            hideloading: true
        })
        if (!isEmpty(res.data)) {
            list.data.arr = [...list.data.arr, ...res.data.commercialBuyInfos]
            list.data.loading = false
            if (list.data.arr.length < 5 || list.data.arr.length === res.data.total) {
                list.data.finished = true
            }
        }
    } catch (err) {
        if (currentPage.value) {
            currentPage.value--
        }
        return false
    }
}

onMounted(async () => {
    const socialNumber = wsCache.get('socialSecurityNumber')
    editAudit.value = $store.getters.editAudit
    if (socialNumber) {
        socialSecurityNumber.value = +socialNumber
    }
    await findBuyListAccess()
})
</script>

<style lang="scss" scoped>
.network-page {
    background-color: #f8f8f8;
    .form-wrap {
        padding-top: 20px;
        background-color: #f8f8f8;
    }
}
</style>
