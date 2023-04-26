<template>
    <div class="relative customer-index">
        <NavBar title="企业基本信息" left-arrow />
        <div class="flex customer-index__body">
            <div class="flex-1 customer-index__wrap">
                <Field
                    v-model="customer"
                    :right-icon="inactiveIcon"
                    name="industryType"
                    label="您的身份"
                    placeholder="请选择行业类型"
                    class="select-cell"
                >
                    <template #input>
                        <div id="drop-container" class="drop-container">
                            <DropdownMenu>
                                <DropdownItem
                                    v-model="customer"
                                    :options="columns"
                                    get-container="#drop-container"
                                ></DropdownItem>
                            </DropdownMenu>
                        </div>
                    </template>
                </Field>
                <div>
                    <VanButton block class="submit-button" native-type="button" @click="submitData">确定</VanButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { NavBar, DropdownMenu, DropdownItem, Field } from 'vant'
import router from '@/router'
import { useCache } from '@/hooks/useCache'

import inactiveIcon from '@/assets/icon/select-icon.png'
import { setRole } from '@/api/customer'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()

const customer = ref('1')
// 身份角色 1-法人 2-经办人
const columns = ref([
    { text: '该企业的法人代表', value: '1' },
    { text: '该企业的经办人', value: '2' }
])

const submitData = async () => {
    try {
        const res = await setRole({
            data: {
                role: customer.value
            }
        })
        if (!isEmpty(res.data)) {
            wsCache.set('token', res.data.token)
            if (!wsCache.get('role')) {
                wsCache.set('role', customer.value)
            }
            setTimeout(() => router.push({ name: 'Enterprise' }), 1000)
        }
    } catch (err) {
        return false
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
