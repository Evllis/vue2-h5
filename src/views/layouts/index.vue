<template>
    <div class="app-container">
        <div class="layout-content">
            <keep-alive v-if="$route.meta.keepAlive">
                <router-view :key="$route.fullPath"></router-view>
            </keep-alive>
            <router-view v-else :key="$route.fullPath"></router-view>
        </div>
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
