<template>
    <div class="relative customer-index">
        <NavBar title="企业基本信息" left-arrow />
        <div class="flex customer-index__body">
            <div class="flex-1 customer-index__wrap">
                <Form @submit="onSubmit" :validate-first="true" :validate-trigger="'onSubmit'">
                    <Field
                        v-model="formData.data.customerName"
                        :rules="rules.customerName"
                        name="customerName"
                        label="姓名"
                        placeholder="请填写姓名"
                        @input="validateInput"
                    />
                    <Field
                        v-model="formData.data.customerNumber"
                        :rules="rules.customerNumber"
                        name="customerNumber"
                        label="工号"
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
    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.5);
    }
    &__body {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        transform: translateY(-50%);
        z-index: 3;
    }
    &__wrap {
        border-radius: 10px;
        background-color: white;
        margin: 0 35px;
        padding: 33px 15px 0 15px;
        color: var(--primary-text-color);
        h3 {
            font-size: 13px;
            margin-bottom: 12px;
        }
    }
    .submit-button {
        background-color: var(--primary-active-color);
        margin-top: 23px;
        line-height: 40px;
        height: 40px;
        color: white;
        font-size: 15px;
        border-radius: 10px;
        border: 0;
        position: absolute;
        bottom: -60px;
        left: 50%;
        margin: 0;
        width: 80%;
        transform: translateX(-50%);
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
