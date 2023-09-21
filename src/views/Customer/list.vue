<template>
    <div class="list-page">
        <NavBar title="客户列表" :style="{ paddingLeft: `15px` }" />
        <div :class="`body-container list-page__body ${isEmpty ? 'empty' : ''}`">
            <div class="customer-wrap">
                <div class="flex justify-center mb-20px">
                    <VanImage :src="listEmpty" class="empty-png" />
                </div>
                <div class="flex justify-center">
                    <VanButton block type="info" native-type="button" class="submit-button" @click="addBusiness"
                        >新增业务申请</VanButton
                    >
                </div>
            </div>
            <!-- <ul class="customer-list"></ul> -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { NavBar, Image as VanImage } from 'vant'
import router from '@/router'

import listEmpty from '@/assets/img/list-empty.png'

const isEmpty = ref(true)

// 新增业务申请
const addBusiness = () => {
    router.push({ name: 'Disclaimer' })
}
</script>

<style lang="scss" scoped>
.list-page {
    &__body {
        &.empty {
            margin-top: 75px;
        }
    }
    .empty-png {
        height: 223px;
    }
    .submit-button {
        width: 310px;
    }
}
</style>
