<template>
    <div class="layout">
        <keep-alive v-if="$route.meta.keepAlive">
            <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
        <router-view v-else :key="$route.fullPath"></router-view>
    </div>
</template>

<script>
export default {
    name: 'AppLayout',
    data() {
        return {}
    },
    components: {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.layout {
    & > * {
        height: 100vh;
    }
}
</style>
