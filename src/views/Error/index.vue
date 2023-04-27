<template>
    <Error @errorClick="errorClick" />
</template>

<script setup>
import Error from '@/components/Error'
import router from '@/router'

const errorClick = () => {
    router.push('/login')
}
</script>
