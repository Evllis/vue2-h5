<template>
    <div class="relative customer-index">
        <NavBar title="联通客户经理信息填写" :style="{ paddingLeft: '15px' }" />
        <div class="flex customer-index__body">
            <div class="flex-1 customer-index__wrap">
                <Form @submit="onSubmit" :validate-first="true" :validate-trigger="'onSubmit'">
                    <Field
                        v-model="formData.data.customerName"
                        :rules="rules.customerName"
                        name="customerName"
                        label=""
                        class="mb-15px flex-row error-pos"
                        placeholder="请填写姓名"
                        @input="validateInput"
                    />
                    <Field
                        v-model="formData.data.customerNumber"
                        :rules="rules.customerNumber"
                        name="customerNumber"
                        label=""
                        class="mb-15px flex-row error-pos"
                        placeholder="请填写工号"
                        @input="validateInput"
                    />
                    <div>
                        <VanButton
                            block
                            type="info"
                            class="submit-button"
                            native-type="submit"
                            :disabled="buttonDisabled"
                            >开始</VanButton
                        >
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { NavBar, Form, Field } from 'vant'
import router from '@/router'
import { nonCharacter } from '@/utils/validate'
import { editCustomerInfo } from '@/api/customer'

const formData = reactive({
    data: {
        customerName: '',
        customerNumber: ''
    }
})
const buttonDisabled = ref(true)

const rules = reactive({
    customerName: [
        { required: true, message: '请填写姓名' },
        { pattern: /^[\u4e00-\u9fa5·]{2,20}$/, message: '长度必须是2-20位中文或·' }
    ],
    customerNumber: [
        { required: true, message: '请填写工号' },
        { validator: nonCharacter, message: '禁止输入表情符号' }
    ]
})

const onSubmit = async values => {
    try {
        await editCustomerInfo({
            data: values
        })
        router.push({ name: 'List' })
    } catch (err) {
        return false
    }
}

const validateInput = () => {
    if (formData.data.customerName && formData.data.customerNumber) {
        buttonDisabled.value = false
    } else {
        buttonDisabled.value = true
    }
}
</script>

<style lang="scss" scoped>
.customer-index {
    &__body {
        flex: 1;
        padding-top: 46px;
    }
    &__wrap {
        border-radius: 10px;
        background-color: white;
        padding: 33px 45px 0 45px;
        color: var(--primary-text-color);
        h3 {
            font-size: 13px;
            margin-bottom: 12px;
        }
    }
    :deep(.van-cell) {
        display: flex;
        align-items: center;
        border-radius: 10px;
        height: 50px;
        padding: 0 15px;
        background-color: #f4f8fb;
        font-size: 16px;
        overflow: initial;
        .van-field__body {
            padding-bottom: 0;
            flex: 1;
            &::after {
                display: none;
            }
        }
        .van-cell__value {
            display: flex;
        }
        .van-field__control {
            line-height: inherit;
        }
    }
    .submit-button {
        background-color: var(--primary-active-color);
        margin-top: 23px;
        line-height: 43px;
        height: 43px;
        color: white;
        font-size: 15px;
        border-radius: 10px;
        border: 0;
        display: block;
    }
    :deep(.van-dropdown-item) {
        height: 88px;
        width: 275px;
        position: absolute;
        top: 20px !important;
        left: 0;
    }
}
</style>
