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
                    <h3 class="fs-13 mb-20px">入网清单</h3>
                    <ul class="package-list">
                        <List
                            v-model="list.data.loading"
                            :finished="list.data.finished"
                            finished-text="没有更多了"
                            @load="findSetmealListAccess"
                        >
                            <li v-for="item in list.data.arr" :key="item.id" class="package-item">
                                <div class="flex items-center package-body">
                                    <div class="flex-1 flex flex-col package-wrap">
                                        <div class="flex package-info">
                                            <span class="truncate max-w-100px">{{ item.name }}</span>
                                            <span class="truncate max-w-100px">{{ item.monthlyPayment }}元/月</span>
                                            <span class="truncate !mr-0">{{ item.period }}期</span>
                                        </div>
                                        <div class="flex text-[var(--primary-active-color)]">
                                            <span class="truncate max-w-100px">电子券{{ item.voucherAmount }}元</span>
                                            <span class="truncate max-w-100px">办理数量x{{ item.number }}</span>
                                        </div>
                                    </div>
                                    <div class="package-opts w-60px">
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
                                <div v-if="item.tradeTime" class="package-desc">
                                    {{ filterDateFormatter(item.tradeTime) }}入网
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
                            to="/cooperate/home"
                            >上一步</VanButton
                        >
                        <template v-if="list.data.arr.length">
                            <VanButton
                                block
                                type="info"
                                native-type="button"
                                class="submit-button"
                                @click="submitFormData"
                                >下一步</VanButton
                            >
                        </template>
                        <template v-else>
                            <VanButton block type="info" native-type="button" class="submit-button" @click="addItem"
                                >新增套餐信息</VanButton
                            >
                        </template>
                    </div>
                    <div v-else class="flex flex-1">
                        <VanButton block type="info" native-type="button" class="submit-button" @click="submitFormData"
                            >提交</VanButton
                        >
                    </div>
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app" class="custom" @closed="popupClosed">
                    <VanIcon name="cross" class="close-icon" @click="showPicker = false" />
                    <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                        <Field
                            v-model="packageData.data.name"
                            name="name"
                            label="套餐名称"
                            placeholder="请输入套餐名称"
                            :rules="rules.name"
                        />
                        <Field
                            v-model="packageData.data.number"
                            name="number"
                            type="digit"
                            label="办理数量"
                            placeholder="请输入办理数量"
                            :rules="rules.number"
                            :formatter="formatterMax"
                        />
                        <Field
                            v-model.number="packageData.data.monthlyPayment"
                            name="monthlyPayment"
                            type="number"
                            label="月套餐费用(元)"
                            placeholder="请输入月套餐费用(元)"
                            :rules="rules.monthlyPayment"
                            :formatter="formatterNumber"
                        />
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
                                <div id="drop-container" class="drop-container">
                                    <div class="drop-placeholder" v-if="placeholderShow">请选择合约期</div>
                                    <DropdownMenu>
                                        <DropdownItem
                                            v-model="packageData.data.period"
                                            :options="columns"
                                            get-container="#drop-container"
                                            @change="dropItemChange"
                                        ></DropdownItem>
                                    </DropdownMenu>
                                </div>
                            </template>
                        </Field>
                        <Field
                            v-model.number="packageData.data.voucherAmount"
                            name="voucherAmount"
                            type="number"
                            label="定向电子券金额(元)"
                            placeholder="请输入定向电子券金额(元)"
                            :rules="rules.voucherAmount"
                            :formatter="formatterNumber"
                        />
                        <Field
                            v-model="packageData.data.tradeTime"
                            :right-icon="inactiveIcon"
                            label="入网日期"
                            readonly
                            clickable
                            placeholder="请输入入网日期"
                            class="select-wrap"
                            :rules="rules.tradeTime"
                            @click="showDate = true"
                        />
                        <div class="shadow-none p-0 submit-footer">
                            <VanButton block type="info" native-type="submit" class="submit-button">{{
                                addType === 'add' ? '确定' : '提交'
                            }}</VanButton>
                        </div>
                    </Form>
                </Popup>
                <Popup v-model="showDate" position="bottom" get-container="#app" class="custom">
                    <DatetimePicker
                        v-model="date.data.currentDate"
                        title="选择年月"
                        type="year-month"
                        :min-date="date.data.minDate"
                        :max-date="date.data.maxDate"
                        @confirm="onConfirm"
                        @cancel="showDate = false"
                    />
                </Popup>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, DatetimePicker, DropdownMenu, DropdownItem, List } from 'vant'
import { reactive, ref, getCurrentInstance, onMounted, nextTick } from 'vue'
import router from '@/router'
import { useCache } from '@/hooks/useCache'

import { editSetmeal, findSetmealList } from '@/api/network'
import { updateStep } from '@/api/common'

import { isCnNumerals } from '@/utils/validate'
import { formatterNumber } from '@/utils'

import inactiveIcon from '@/assets/icon/select-icon.png'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const list = reactive({
    data: {
        loading: false,
        finished: false,
        arr: []
    }
})
const rules = reactive({
    name: [
        { required: true, message: '请填写套餐名称' },
        { validator: isCnNumerals, message: '请输入正确的套餐名称' }
    ],
    number: [{ required: true, message: '请填写办理数量' }],
    monthlyPayment: [{ required: true, message: '请填写月套餐费用' }],
    period: [{ required: true, message: '请选择合约期' }],
    voucherAmount: [{ required: true, message: '请填写定向电子券金额' }],
    tradeTime: [{ required: true, message: '请填写入网日期' }]
})

const setmealId = ref('')
const currentPage = ref(0)
const date = reactive({
    data: {
        currentDate: new Date(new Date().getFullYear(), new Date().getMonth()),
        minDate: new Date(new Date().getFullYear(), new Date().getMonth())
    }
})
const addType = ref('add')
const formRef = ref()
const packageData = reactive({
    data: {
        name: '', // 套餐名称
        number: '', // 办理数量
        monthlyPayment: '', // 月套餐费用(元)
        period: '', // 合约期
        voucherAmount: '', // 定向电子券金额(元)
        tradeTime: '' // 入网时间
    }
})
const columns = ref([
    { text: '12', value: '12' },
    { text: '24', value: '24' },
    { text: '30', value: '30' },
    { text: '36', value: '36' }
])
const showPicker = ref(false)
const showDate = ref(false)
const socialSecurityNumber = ref(0)
const editAudit = ref(false)
const placeholderShow = ref(true)

const dropItemChange = () => {
    placeholderShow.value = false
}

const onConfirm = val => {
    const date = new Date(val)
    let month = date.getMonth() + 1
    month = month < 10 ? `0${month}` : month
    packageData.data.tradeTime = `${date.getFullYear()}-${month}`
    showDate.value = false
}

const popupClosed = () => {
    placeholderShow.value = true
    for (const i in packageData.data) {
        packageData.data[i] = ''
    }
}

const onClickLeft = () => {
    router.push({ name: 'Cooperate' })
}

const formatterMax = val => {
    if (+val > socialSecurityNumber.value) {
        return socialSecurityNumber.value
    }
    return val
}

// 编辑单项
const editItem = item => {
    addType.value = 'edit'
    showPicker.value = true
    placeholderShow.value = false
    packageData.data = {
        name: item.name,
        number: item.number,
        monthlyPayment: item.monthlyPayment,
        period: item.period,
        voucherAmount: item.voucherAmount,
        tradeTime: item.tradeTime
    }
    setmealId.value = item.id
}

const submitFormData = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    try {
        await updateStep({
            data: {
                enterpriseId: enterpriseId || '',
                step: '5'
            }
        })
        router.push({ name: !editAudit.value ? 'Procurement' : 'Audit' })
    } catch (err) {
        return false
    }
}

const onSubmit = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        packageData.data['enterpriseId'] = enterpriseId
        if (setmealId.value) {
            packageData.data['setmealId'] = setmealId.value
        }
        formRef.value
            .validate()
            .then(async () => {
                try {
                    await editSetmeal({
                        data: packageData.data
                    })
                    popupClosed()
                    showPicker.value = false
                    await nextTick()
                    list.data.arr.length = 0
                    currentPage.value = 0
                    date.data.currentDate = new Date(new Date().getFullYear(), new Date().getMonth())
                    list.data.finished = false
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

const addItem = () => {
    addType.value = 'add'
    setmealId.value = ''
    popupClosed()
    showPicker.value = true
}

onMounted(async () => {
    const socialNumber = wsCache.get('socialSecurityNumber')
    editAudit.value = $store.getters.editAudit
    if (socialNumber) {
        socialSecurityNumber.value = +socialNumber
    }
})

const findSetmealListAccess = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    currentPage.value++
    try {
        const res = await findSetmealList({
            data: {
                enterpriseId: enterpriseId,
                currentPage: currentPage.value
            },
            hideloading: true
        })
        if (!isEmpty(res.data)) {
            list.data.arr = [...list.data.arr, ...res.data.commercialSetmealInfos]
            list.data.loading = false
            if (list.data.arr.length < 5 || list.data.arr.length === res.data.total) {
                list.data.finished = true
            }
        }
    } catch (err) {
        return false
    }
}

const filterDateFormatter = val => {
    const date = val.split('-')
    return `${date[0]}年${date[1]}月`
}
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
