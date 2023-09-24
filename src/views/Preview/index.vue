<template>
    <div class="preview-page">
        <NavBar title="协议预览" :left-arrow="!editAudit" @click-left="onClickLeft" />
        <div class="body-container preview-page__body">
            <Preview />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { NavBar } from 'vant'
// import router from '@/router'

import Preview from '@/components/Preview'

const instance = getCurrentInstance()
const { $store } = instance.proxy

const editAudit = ref(false)

const onClickLeft = () => {
    // router.push({ name: 'Receipt' })
}

onMounted(async () => {
    editAudit.value = $store.getters.editAudit
})
</script>
