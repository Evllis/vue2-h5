<template>
    <div class="preview-page">
        <NavBar
            :title="isSuccess ? '收货确认单' : '协议预览'"
            :left-arrow="!isSuccess"
            @click-left="onClickLeft"
            :style="{ paddingLeft: `${isSuccess ? '15px' : ''}` }"
        />
        <div class="body-container preview-page__body">
            <Preview :isSubmit="isSuccess" :isAlert="isSuccess" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NavBar } from 'vant'
import router from '@/router'

import Preview from '@/components/Preview'

const isSuccess = ref(false)

const onClickLeft = () => {
    router.push({ name: 'Receipt' })
}

onMounted(() => {
    isSuccess.value = !!router?.history?.current?.query?.success
})
</script>
