<template>
    <div class="preview-page">
        <NavBar title="协议预览" left-arrow @click-left="onClickLeft" />
        <div class="body-container preview-page__body">
            <Preview />
        </div>
    </div>
</template>

<script setup>
import { NavBar } from 'vant'
import router from '@/router'

import Preview from '@/components/Preview'

const onClickLeft = () => {
    router.push({ name: 'Receipt' })
}
</script>
