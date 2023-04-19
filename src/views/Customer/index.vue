<template>
    <div class="relative customer-index">
        <NavBar title="企业基本信息" left-arrow />
        <div class="flex customer-index__body">
            <div class="flex-1 customer-index__wrap">
                <h3>您的身份</h3>
                <Field
                    :value="customer"
                    :right-icon="inactiveIcon"
                    readonly
                    clickable
                    name="picker"
                    placeholder=""
                    class="select-wrap"
                    @click="showPicker = true"
                />
                <div>
                    <VanButton block class="submit-button">确定</VanButton>
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app">
                    <Picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
                </Popup>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Field, Popup, Picker, NavBar } from 'vant'

import inactiveIcon from '@/assets/icon/select-icon.png'

const customer = ref('该企业的法人代表')
const showPicker = ref(false)
// 身份角色 1-法人 2-经办人
const columns = ref(['该企业的法人代表', '该企业的经办人'])

const onConfirm = val => {
    customer.value = val
    showPicker.value = false
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
        height: 192px;
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
    }
}
</style>
