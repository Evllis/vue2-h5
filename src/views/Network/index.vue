<template>
    <div class="network-page">
        <NavBar
            title="合同预填写"
            left-arrow
            :right-text="setmealList.length ? '新增' : ''"
            @click-right="onClickRight"
        />
        <div class="body-container network-page__body pt-25px">
            <div class="van-form">
                <div class="form-wrap">
                    <h3 class="fs-13">入网清单</h3>
                    <div class="scroll-wrap">
                        <ul class="package-list">
                            <!-- <li class="package-item">
                                <div class="flex items-center package-body">
                                    <div class="flex-1 flex flex-col package-wrap">
                                        <div class="flex package-info">
                                            <span>冰激凌199套餐</span>
                                            <span>199元/月</span>
                                            <span>24期</span>
                                        </div>
                                        <div class="text-[var(--primary-active-color)]">
                                            <span>电子券109元</span>
                                            <span>办理数量x9999</span>
                                        </div>
                                    </div>
                                    <div class="package-opts">
                                        <VanButton
                                            plain
                                            type="primary"
                                            native-type="button"
                                            color="var(--primary-active-color)"
                                            >编辑</VanButton
                                        >
                                    </div>
                                </div>
                                <div class="package-desc">2023年3月入网</div>
                            </li> -->
                        </ul>
                    </div>
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button mr-10px">上一步</VanButton>
                    <template v-if="setmealList.length">
                        <VanButton block type="info" native-type="submit" class="submit-button">下一步</VanButton>
                    </template>
                    <template v-else>
                        <VanButton
                            block
                            type="info"
                            native-type="button"
                            class="submit-button"
                            @click="showPicker = true"
                            >新增套餐信息</VanButton
                        >
                    </template>
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app" class="custom" @closed="popupClosed">
                    <VanIcon name="cross" class="close-icon" @click="showPicker = false" />
                    <Form @submit="onSubmit" ref="formRef">
                        <Field
                            v-model="packageData.data.name"
                            name="name"
                            label="套餐名称"
                            placeholder="请输入套餐名称"
                            @change="changeValidate('name')"
                            :rules="rules.name"
                        />
                        <Field
                            v-model="packageData.data.number"
                            name="number"
                            type="digit"
                            label="办理数量"
                            placeholder="请输入办理数量"
                            @change="changeValidate('number')"
                            :rules="rules.number"
                        />
                        <Field
                            v-model.number="packageData.data.monthlyPayment"
                            name="monthlyPayment"
                            type="number"
                            label="月套餐费用(元)"
                            placeholder="请输入月套餐费用(元)"
                            @change="changeValidate('monthlyPayment')"
                            :rules="rules.monthlyPayment"
                            :formatter="formatterNumber"
                        />
                        <div class="mb-25px">
                            <h3 class="custom-label">合约期</h3>
                            <div id="drop-container" class="drop-container">
                                <div class="drop-placeholder" v-if="placeholderShow">请输入合约期</div>
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="packageData.data.period"
                                        :options="columns"
                                        @change="dropItemChange"
                                        get-container="#drop-container"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Field
                            v-model.number="packageData.data.voucherAmount"
                            name="voucherAmount"
                            type="number"
                            label="定向电子券金额(元)"
                            placeholder="请输入定向电子券金额(元)"
                            @change="changeValidate('voucherAmount')"
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
                            @change="changeValidate('tradeTime')"
                            :rules="rules.tradeTime"
                            @click="showDate = true"
                        />
                        <div class="shadow-none p-0 submit-footer">
                            <VanButton block type="info" native-type="submit" class="submit-button">确定</VanButton>
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
import { NavBar, Form, Field, Popup, DatetimePicker, DropdownMenu, DropdownItem } from 'vant'
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import router from '@/router'

import { editSetmeal, findSetmealList } from '@/api/network'

import { isCnNumerals } from '@/utils/validate'

import inactiveIcon from '@/assets/icon/select-icon.png'
import { isEmpty } from 'lodash-es'

const instance = getCurrentInstance()
const { $toast } = instance.proxy

const rules = reactive({
    name: [
        { required: true, message: '请填写套餐名称' },
        { validator: isCnNumerals, message: '请输入正确的套餐名称' }
    ],
    number: [{ required: true, message: '请填写办理数量' }],
    monthlyPayment: [{ required: true, message: '请填写月套餐费用' }],
    voucherAmount: [{ required: true, message: '请填写定向电子券金额' }],
    tradeTime: [{ required: true, message: '请填写入网日期' }]
})

const currentPage = ref(1)
const date = reactive({
    data: {
        currentDate: new Date(new Date().getFullYear(), new Date().getMonth()),
        minDate: new Date(new Date().getFullYear(), new Date().getMonth())
    }
})
const placeholderShow = ref(true)
const submitDisabled = ref(true)
const formRef = ref()
const setmealList = ref([])
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
const formData = reactive({
    data: {
        list: []
    }
})
const showPicker = ref(false)
const showDate = ref(false)

const dropItemChange = () => {
    placeholderShow.value = false
    updateSubmitButton()
}

const updateSubmitButton = () => {
    let status = true
    for (const key in packageData.data) {
        const val = packageData.data[key]
        if (!val.length) {
            status = false
            break
        }
        if (key === 'name' && !isCnNumerals(val)) {
            status = false
            break
        }
    }
    submitDisabled.value = !status
}

const onConfirm = val => {
    const date = new Date(val)
    let month = date.getMonth() + 1
    month = month < 10 ? `0${month}` : month
    packageData.data.tradeTime = `${date.getFullYear()}-${month}`
    console.log(111111, packageData.data.tradeTime)
    showDate.value = false
}

const popupClosed = () => {
    for (const i in packageData.data) {
        packageData.data[i] = ''
    }
}

const onSubmit = async () => {
    console.log(555555, packageData.data)
    // const enterpriseId = $store.getters.enterpriseId
    const enterpriseId = '1650026719275147264'
    if (enterpriseId) {
        // formData.data['enterpriseId'] = $store.getters.enterpriseId
        packageData.data['enterpriseId'] = enterpriseId
        try {
            await editSetmeal({
                data: packageData.data
            })
            showPicker.value = false
            popupClosed()
            await findSetmealListAccess()
        } catch (err) {
            return false
        }
    } else {
        $toast.fail({
            message: '请重新登录',
            onClose: () => {
                router.push({ name: 'Login' })
            }
        })
    }
}

const changeValidate = type => {
    formRef.value
        .validate(type)
        .then(async () => {
            updateSubmitButton()
        })
        .catch(() => {
            updateSubmitButton()
        })
}

const onClickRight = () => {}

const findSetmealListAccess = async () => {
    // const enterpriseId = $store.getters.enterpriseId
    try {
        const res = await findSetmealList({
            data: {
                enterpriseId: '1650026719275147264',
                currentPage: currentPage.value
            },
            hideloading: true
        })
        if (!isEmpty(res.data)) {
            console.log(res)
        }
    } catch (err) {
        return false
    }
}

/**
 * formatter
 */
const formatterNumber = val => {
    if (val !== '' && val.substr(0, 1) === '.') {
        val = ''
    }
    val = val.replace(/^0*(0\.|[1-9])/, '$1')
    val = val.replace(/[^\d.]/g, '')
    val = val.replace(/\.{2,}/g, '.')
    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    val = val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    if (val.indexOf('.') < 0 && val !== '') {
        if (val.substr(0, 1) === '0' && val.length === 2) {
            val = val.substr(1, val.length)
        }
    }
    if (val <= 0) return ''
    return val
}

onMounted(async () => {
    await findSetmealListAccess()
})
</script>

<style lang="scss" scoped>
.network-page {
    background-color: #f8f8f8;
}
</style>
