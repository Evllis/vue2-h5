<template>
    <div class="relative customer-index">
        <NavBar title="企业基本信息" left-arrow />
        <div class="flex customer-index__body">
            <div class="flex-1 customer-index__wrap">
                <h3>您的身份</h3>
                <div id="drop-container" class="drop-container">
                    <DropdownMenu>
                        <DropdownItem
                            v-model="customer"
                            :options="columns"
                            get-container="#drop-container"
                        ></DropdownItem>
                    </DropdownMenu>
                </div>
                <div>
                    <VanButton block class="submit-button" native-type="button" @click="submitData">确定</VanButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { NavBar, DropdownMenu, DropdownItem } from 'vant'
import { useRouter } from 'vue-router/composables'

import { setRole } from '@/api/customer'

const router = useRouter()
const customer = ref('1')
// 身份角色 1-法人 2-经办人
const columns = ref([
    { text: '该企业的法人代表', value: '1' },
    { text: '该企业的经办人', value: '2' }
])

const submitData = async () => {
    try {
        await setRole({
            role: customer.value
        })
        setTimeout(() => router.push({ name: 'Enterprise' }), 1000)
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
}
</style>
