<template>
    <div class="flex login">
        <div class="flex-1 relative login__body">
            <div class="flex items-center justify-center login__body-mask">
                <h1 class="text-[var(--primary-active-text-color)]">登录注册</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
// import { ref } from 'vue'

// let list = ref([
//     'Vue-cli4',
//     '配置多环境变量',
//     'VantUI 组件按需加载',
//     'Sass 全局样式',
//     'Webpack 4',
//     'Vuex 状态管理',
//     'Axios 封装及接口管理',
//     'Vue-router',
//     'Webpack 4 vue.config.js 基础配置',
//     '配置 proxy 跨域',
//     '配置 alias 别名',
//     '配置 打包分析',
//     '配置 externals 引入 cdn 资源',
//     '去掉 console.log',
//     'splitChunks 单独打包第三方模块',
//     '添加 IE 兼容',
//     'Eslint+Pettier 统一开发规范'
// ])
</script>

<style lang="scss" scoped>
.login {
    background: url('~@/assets/img/login-bg.png') no-repeat top / cover;
    &__body {
        background-color: white;
        border-radius: 20px 20px 0 0;
        margin: 0 12px;
        margin-top: 250px;
    }
    &__body-mask {
        width: 100%;
        border-radius: 20px 20px 0 0;
        position: absolute;
        left: 0;
        top: -40px;
        height: 66px;
        background: url('~@/assets/img/login-bg-mask.png') no-repeat top / cover;
        h1 {
            font-size: 15px;
            position: absolute;
            left: 50%;
            top: 10px;
            transform: translateX(-50%);
        }
    }
}
</style>
