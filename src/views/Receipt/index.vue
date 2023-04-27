<template>
    <div class="receipt-page">
        <NavBar title="合同预填写" left-arrow @click-left="onClickLeft" />
        <div class="body-container receipt-page__body">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div v-if="!isAudit" class="form-wrap pt-25px">
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
                        label="支付款合计(元)"
                        placeholder="请输入支付款合计(元)"
                        @change="changeValidate('monthlyPaymentSum')"
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
                <div v-else class="form-wrap" :style="{ backgroundColor: '#F8F8F8', paddingTop: '20px' }">
                    <div class="mt-0 scroll-wrap">
                        <ul class="package-list">
                            <li v-for="item in auditList" :key="item.step" class="package-item">
                                <div class="flex items-center package-body">
                                    <div class="flex-1 flex flex-col package-wrap">
                                        <div class="flex package-info text-[var(--secondary-color)]">
                                            <span>{{ item.step }}</span>
                                        </div>
                                        <div>
                                            <span>{{ item.msg }}</span>
                                        </div>
                                    </div>
                                    <div class="package-opts">
                                        <VanButton
                                            plain
                                            type="primary"
                                            native-type="button"
                                            color="var(--primary-active-color)"
                                            @click="modifyAudit(item)"
                                            >修改</VanButton
                                        >
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-if="!isAudit" class="flex submit-footer">
                    <VanButton
                        block
                        type="info"
                        native-type="button"
                        class="submit-button mr-10px"
                        to="/procurement/home"
                        >上一步</VanButton
                    >
                    <VanButton block :disabled="submitDisabled" type="info" native-type="submit" class="submit-button"
                        >下一步</VanButton
                    >
                </div>
                <div v-else class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button" to="/preview/home"
                        >全部提交</VanButton
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
import { useCache } from '@/hooks/useCache'

import { submitEnterpriseContract, findEnterpriseContract } from '@/api/receipt'
import { queryAudit } from '@/api/audit'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const isAudit = ref(false)
const auditList = ref([])
const submitDisabled = ref(true)
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

const changeValidate = name => {
    formRef.value
        .validate(name)
        .then(async () => {
            submitDisabled.value = false
        })
        .catch(() => {
            submitDisabled.value = true
        })
}

const modifyAudit = item => {
    console.log(4444, item)
}

const onClickLeft = () => {
    router.push({ name: 'Procurement' })
}

const queryAuditAccess = async enterpriseId => {
    try {
        const res = await queryAudit({
            data: {
                enterpriseId
            },
            hideloading: true
        })
        if (!isEmpty(res)) {
            // res.data.auditStatus: 审核状态：1-未提交 2-审核中 3-审核通过 4-审核驳回 5-审核拒绝
            auditList.value = res.data.auditList.map(item => item)
        }
    } catch (err) {
        return false
    }
}

onMounted(async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    isAudit.value = router?.history?.current?.query?.is ? true : false
    if (isAudit.value) {
        queryAuditAccess(enterpriseId)
        return false
    }
    if (enterpriseId) {
        try {
            const res = await findEnterpriseContract({
                data: {
                    enterpriseId
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                formData.data = res.data
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
