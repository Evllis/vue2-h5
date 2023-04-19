<template>
    <div class="enterprise-page">
        <NavBar title="企业基本信息" left-arrow />
        <div class="enterprise-page__body">
            <Form @submit="onSubmit">
                <Field
                    v-model="username"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <Field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
                <div style="margin: 16px">
                    <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field } from 'vant'
</script>

<style lang="scss" scoped>
.enterprise-page {
    &__body {
        padding: 0 15px;
        :deep(.van-cell) {
            flex-direction: column;
        }
    }
}
</style>
