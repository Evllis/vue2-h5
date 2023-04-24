<template>
    <div class="network-page">
        <NavBar
            title="合同预填写"
            left-arrow
            :right-text="list.data.arr.length ? '新增' : ''"
            @click-right="onClickRight"
        />
        <div class="body-container network-page__body pt-25px">
            <div class="van-form">
                <div class="form-wrap">
                    <h3 class="fs-13">采购清单</h3>
                    <div class="scroll-wrap">
                        <ul class="package-list">
                            <div v-if="!list.data.arr.length">
                                <Skeleton v-for="index of 4" :row="3" :key="index" class="mb-30px" />
                            </div>
                            <div v-else>
                                <List
                                    v-model="list.data.loading"
                                    :finished="list.data.finished"
                                    :immediate-check="false"
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
                                                    >编辑</VanButton
                                                >
                                            </div>
                                        </div>
                                    </li>
                                </List>
                            </div>
                        </ul>
                    </div>
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button mr-10px">上一步</VanButton>
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
                        <VanButton
                            block
                            type="info"
                            native-type="button"
                            class="submit-button"
                            @click="showPicker = true"
                            >新增采购信息</VanButton
                        >
                    </template>
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app" class="custom" @closed="popupClosed">
                    <VanIcon name="cross" class="close-icon" @click="showPicker = false" />
                    <Form @submit="onSubmit" ref="formRef">
                        <div class="mb-25px">
                            <h3 class="custom-label">合约期</h3>
                            <div id="period" class="drop-container">
                                <div class="drop-placeholder" v-if="!packageData.data.period">请输入合约期</div>
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="packageData.data.period"
                                        :options="columns"
                                        get-container="#period"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div class="mb-25px">
                            <h3 class="custom-label">品类</h3>
                            <div id="category" class="drop-container">
                                <div class="drop-placeholder" v-if="!packageData.data.category">请选择品类</div>
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="packageData.data.category"
                                        :options="categoryColumns"
                                        get-container="#category"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Field
                            v-model="packageData.data.brand"
                            name="brand"
                            label="品牌/型号"
                            placeholder="请输入品牌/型号"
                            @change="changeValidate('brand')"
                            :rules="rules.brand"
                        />
                        <Field
                            v-model="packageData.data.dispose"
                            name="dispose"
                            label="配置"
                            placeholder="请输入配置"
                            @change="changeValidate('dispose')"
                            :rules="rules.dispose"
                        />
                        <Field
                            v-model="packageData.data.count"
                            name="count"
                            type="digit"
                            label="数量"
                            placeholder="请输入数量"
                            @change="changeValidate('count')"
                            :rules="rules.count"
                        />
                        <Field
                            v-model="packageData.data.monthlyPayment"
                            type="number"
                            name="monthlyPayment"
                            label="月支付金额(元/台)"
                            placeholder="请输入月支付金额(元/台)"
                            @change="changeValidate('monthlyPayment')"
                            :rules="rules.monthlyPayment"
                            :formatter="formatterNumber"
                        />
                        <div class="shadow-none p-0 submit-footer">
                            <VanButton
                                block
                                :disabled="submitDisabled"
                                type="info"
                                native-type="submit"
                                class="submit-button"
                                >确定</VanButton
                            >
                        </div>
                    </Form>
                </Popup>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, Skeleton, List, DropdownMenu, DropdownItem } from 'vant'
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { isEmpty } from 'lodash-es'
import { formatterNumber } from '@/utils'
import router from '@/router'

import { updateStep } from '@/api/common'
import { findBuyList, editBuy } from '@/api/procurement'

const instance = getCurrentInstance()
const { $toast } = instance.proxy

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
const submitDisabled = ref(true)
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

const popupClosed = () => {
    for (const i in packageData.data) {
        packageData.data[i] = ''
    }
}

const updateSubmitButton = () => {
    let status = true
    for (const key in packageData.data) {
        const val = packageData.data[key]
        if (!val.length) {
            status = false
            break
        }
    }
    submitDisabled.value = !status
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

const onSubmit = async () => {
    // const enterpriseId = $store.getters.enterpriseId
    const enterpriseId = '1650026719275147264'
    if (enterpriseId) {
        // formData.data['enterpriseId'] = $store.getters.enterpriseId
        packageData.data['enterpriseId'] = enterpriseId
        try {
            await editBuy({
                data: packageData.data
            })
            showPicker.value = false
            popupClosed()
            list.data.arr.length = 0
            currentPage.value = 1
            await findBuyListAccess()
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

const submitFormData = async () => {
    // const enterpriseId = $store.getters.enterpriseId
    const enterpriseId = '1650026719275147264'
    try {
        await updateStep({
            data: {
                enterpriseId: enterpriseId || '',
                step: '6'
            }
        })
        setTimeout(() => router.push({ name: 'Receipt' }), 1500)
    } catch (err) {
        return false
    }
}

const onClickRight = () => {
    showPicker.value = true
}

const findBuyListAccess = async () => {
    // const enterpriseId = $store.getters.enterpriseId
    currentPage.value++
    try {
        const res = await findBuyList({
            data: {
                enterpriseId: '1650026719275147264',
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
            console.log(list.data.arr)
        }
    } catch (err) {
        return false
    }
}

onMounted(async () => {
    await findBuyListAccess()
})
</script>

<style lang="scss" scoped>
.network-page {
    background-color: #f8f8f8;
    .form-wrap {
        background-color: #f8f8f8;
    }
}
</style>
