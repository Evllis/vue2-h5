<template>
    <Error @errorClick="errorClick" />
</template>

<script setup>
import Error from '@/components/Error'
import { useRouter } from 'vue-router/composables'

const router = useRouter()

const errorClick = () => {
    router.push('/login')
}
</script>
