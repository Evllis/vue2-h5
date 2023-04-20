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

<style lang="scss">
.layout {
    & > * {
        height: 100vh;
        display: flex;
        flex-direction: column;
        & > .body-container,
        & > .body-container > .van-form,
        .form-wrap {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
