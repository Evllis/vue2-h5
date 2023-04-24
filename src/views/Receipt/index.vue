<template>
    <div class="receipt-page">
        <NavBar title="合同预填写" left-arrow />
        <div class="body-container receipt-page__body">
            <Form @submit="onSubmit" ref="formRef">
                <div class="form-wrap pt-25px">
                    <Field
                        v-model="formData.data.firstPaymentSum"
                        name="firstPaymentSum"
                        type="number"
                        label="首付款(元)"
                        placeholder="请输入首付款(元)"
                        @change="changeValidate('firstPaymentSum')"
                        :rules="rules.firstPaymentSum"
                        :formatter="formatterNumber"
                    />
                    <Field
                        v-model="formData.data.monthlyPaymentSum"
                        name="monthlyPaymentSum"
                        type="number"
                        label="月支付款合计(元)"
                        placeholder="请输入月支付款合计(元)"
                        @change="changeValidate('monthlyPaymentSum')"
                        :rules="rules.monthlyPaymentSum"
                        :formatter="formatterNumber"
                    />
                    <Field v-model="enterpriseName" label="收货单位" placeholder="请输入企业名称" readonly />
                    <Field
                        v-model="formData.data.consigneeName"
                        name="consigneeName"
                        label="收货人姓名"
                        placeholder="请输入收货人姓名"
                        @change="changeValidate('consigneeName')"
                        :rules="rules.consigneeName"
                    />
                    <Field
                        v-model="formData.data.consigneePhone"
                        name="consigneePhone"
                        label="收货人联系方式"
                        placeholder="请输入收货人联系方式"
                        @change="changeValidate('consigneePhone')"
                        :rules="rules.consigneePhone"
                    />
                    <Field
                        v-model="formData.data.consigneeAddress"
                        name="consigneeAddress"
                        label="收货地址"
                        placeholder="请输入收货地址"
                        @change="changeValidate('consigneeAddress')"
                        :rules="rules.consigneeAddress"
                    />
                </div>
                <!-- <div class="form-wrap">
                    <div class="mt-0 scroll-wrap">
                        <ul class="package-list">
                            <li class="package-item">
                                <div class="flex items-center package-body">
                                    <div class="flex-1 flex flex-col package-wrap">
                                        <div class="flex package-info text-[var(--secondary-color)]">
                                            <span>企业基本信息</span>
                                        </div>
                                        <div>
                                            <span>营业执照不清晰，请重新提交！</span>
                                        </div>
                                    </div>
                                    <div class="package-opts">
                                        <VanButton
                                            plain
                                            type="primary"
                                            native-type="button"
                                            color="var(--primary-active-color)"
                                            >修改</VanButton
                                        >
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div> -->
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button mr-10px">上一步</VanButton>
                    <VanButton block :disabled="submitDisabled" type="info" native-type="submit" class="submit-button"
                        >下一步</VanButton
                    >
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field } from 'vant'
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import router from '@/router'
import { formatterNumber } from '@/utils'
import { isName, isPhone, isAddress } from '@/utils/validate'

import { submitEnterpriseContract, findEnterpriseContract } from '@/api/receipt'

const instance = getCurrentInstance()
const { $toast } = instance.proxy

const enterpriseName = ref('')
const submitDisabled = ref(true)
const formRef = ref()
const formData = reactive({
    data: {
        firstPaymentSum: '', // 首付款合计(元)
        monthlyPaymentSum: '', // 月支付款合计(元)
        consigneeName: '', // 收货人姓名
        consigneePhone: '', // 收货人联系方式
        consigneeAddress: '' // 收货人地址
    }
})
const rules = reactive({
    firstPaymentSum: [{ required: true, message: '请填写首付款' }],
    monthlyPaymentSum: [{ required: true, message: '请填写月支付款合计' }],
    consigneeName: [
        { required: true, message: '请填写收货人姓名' },
        { validator: isName, message: '请输入正确的收货人姓名' }
    ],
    consigneePhone: [
        { required: true, message: '请填写收货人联系方式' },
        { validator: isPhone, message: '请输入正确的收货人联系方式' }
    ],
    consigneeAddress: [
        { required: true, message: '请填写收货人地址' },
        { validator: isAddress, message: '请输入正确的收货人地址' }
    ]
})

const onSubmit = async () => {
    // const enterpriseId = $store.getters.enterpriseId
    const enterpriseId = '1650026719275147264'
    if (enterpriseId) {
        // formData.data['enterpriseId'] = $store.getters.enterpriseId
        formData.data['enterpriseId'] = enterpriseId
        try {
            await submitEnterpriseContract({
                data: formData.data
            })
            setTimeout(() => router.push({ name: 'Preview' }), 1500)
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

const updateSubmitButton = () => {
    let status = true
    for (const key in formData.data) {
        const val = formData.data[key]
        if (!val.length) {
            status = false
            break
        }
        if (
            (key === 'consigneeName' && !isName(val)) ||
            (key === 'consigneePhone' && !isPhone(val)) ||
            (key === 'consigneeAddress' && !isAddress(val))
        ) {
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

onMounted(async () => {
    // const enterpriseId = $store.getters.enterpriseId
    const enterpriseId = '1650026719275147264'
    if (enterpriseId) {
        try {
            const res = await findEnterpriseContract({
                data: {
                    enterpriseId
                },
                hideloading: true
            })
            console.log(666666, res)
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
})
</script>
