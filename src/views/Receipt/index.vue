<template>
    <div class="receipt-page">
        <NavBar
            title="合同预填写"
            :left-arrow="!editAudit"
            @click-left="onClickLeft"
            :style="{ paddingLeft: `${editAudit ? '15px' : ''}` }"
        />
        <div class="body-container receipt-page__body">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <Field
                        v-model="formData.data.firstPaymentSum"
                        name="firstPaymentSum"
                        type="number"
                        label="首付款(元)"
                        placeholder="请输入首付款(元)"
                        :rules="rules.firstPaymentSum"
                        :formatter="formatterNumberZero"
                    />
                    <Field
                        v-model="formData.data.monthlyPaymentSum"
                        name="monthlyPaymentSum"
                        type="number"
                        label="支付款合计(元)"
                        placeholder="请输入支付款合计(元)"
                        :rules="rules.monthlyPaymentSum"
                        :formatter="formatterNumber"
                    />
                    <Field
                        v-model="formData.data.enterpriseName"
                        label="收货单位"
                        placeholder="请输入企业名称"
                        readonly
                    />
                    <Field
                        v-model="formData.data.consigneeName"
                        name="consigneeName"
                        label="收货人姓名"
                        placeholder="请输入收货人姓名"
                        :rules="rules.consigneeName"
                    />
                    <Field
                        v-model="formData.data.consigneePhone"
                        name="consigneePhone"
                        label="收货人联系方式"
                        placeholder="请输入收货人联系方式"
                        :rules="rules.consigneePhone"
                    />
                    <Field
                        v-model="formData.data.consigneeAddress"
                        name="consigneeAddress"
                        label="收货地址"
                        placeholder="请输入收货地址"
                        :rules="rules.consigneeAddress"
                    />
                </div>
                <div class="flex submit-footer">
                    <VanButton
                        v-if="!editAudit"
                        block
                        type="info"
                        native-type="button"
                        class="submit-button mr-10px"
                        to="/procurement/home"
                        >上一步</VanButton
                    >
                    <VanButton block type="info" native-type="submit" class="submit-button">{{
                        editAudit ? '提交' : '下一步'
                    }}</VanButton>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field } from 'vant'
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import router from '@/router'
import { formatterNumber, formatterNumberZero } from '@/utils'
import { isName, isPhone, isAddress } from '@/utils/validate'
import { useCache } from '@/hooks/useCache'

import { submitEnterpriseContract, findEnterpriseContract } from '@/api/receipt'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const editAudit = ref(false)
const formRef = ref()
const formData = reactive({
    data: {
        firstPaymentSum: '', // 首付款合计(元)
        monthlyPaymentSum: '', // 月支付款合计(元)
        enterpriseName: '', // 收货单位
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
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        formData.data['enterpriseId'] = enterpriseId
        formRef.value
            .validate()
            .then(async () => {
                try {
                    await submitEnterpriseContract({
                        data: formData.data
                    })
                    router.push({ name: !editAudit.value ? 'Preview' : 'Audit' })
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

const onClickLeft = () => {
    router.push({ name: 'Procurement' })
}

onMounted(async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    editAudit.value = $store.getters.editAudit
    if (enterpriseId) {
        try {
            const res = await findEnterpriseContract({
                data: {
                    enterpriseId
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                if (res.data.consigneeAddress) {
                    formData.data = res.data
                } else {
                    formData.data.enterpriseName = res.data.enterpriseName
                }
            }
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
