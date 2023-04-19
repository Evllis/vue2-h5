<template>
    <div class="flex login">
        <div class="flex-1 relative login__body">
            <div class="flex items-center justify-center login__body-mask">
                <h1 class="text-[var(--primary-active-text-color)]">登录注册</h1>
            </div>
            <Form @submit="onSubmit" class="relative h-full">
                <Field v-model="phone" type="tel" name="手机号" label="" placeholder="请输入手机号码" class="mb-15px" />
                <Field v-model="code" type="digit" name="验证码" label="" placeholder="请输入验证码" maxlength="6">
                    <template #button>
                        <VanButton
                            :disabled="codeButton.data.disabled"
                            @click="getCode"
                            native-type="button"
                            class="text-[var(--primary-active-text-color)] get-code"
                            >{{ codeButton.data.text }}</VanButton
                        >
                    </template>
                </Field>
                <Field name="agreement" class="w-full agreement-input">
                    <template #input>
                        <VanCheckbox v-model="agreement" checked-color="var(--primary-active-text-color)">
                            <template #icon>
                                <img class="img-icon" :src="agreement ? activeIcon : inactiveIcon" />
                            </template>
                            <template #default>
                                我已阅读并同意
                                <a href="">《信息授权协议》</a>
                            </template>
                        </VanCheckbox>
                    </template>
                </Field>
                <div>
                    <VanButton block type="info" native-type="submit" class="submit-button">提交</VanButton>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Form, Field, Toast } from 'vant'
import { isPhone } from '@/utils/validate'
import { useRouter } from 'vue-router/composables'

import { sendMsg } from '@/api/login'

import inactiveIcon from '@/assets/icon/checkbox-icon.png'
import activeIcon from '@/assets/icon/checkbox-checked-icon.png'

const router = useRouter()
const agreement = ref(false)
const phone = ref('')
const code = ref('')
const codeButton = reactive({
    data: {
        disabled: false,
        text: '发送验证码'
    }
})
const codeTimer = ref(0)
const codeTime = ref(60)

// 获取手机验证码
const getCode = async () => {
    if (!isPhone(phone.value)) {
        Toast.fail('请输入正确的手机号')
        return false
    }
    if (isPhone(phone.value)) {
        const res = await sendMsg({ phone }).catch(() => {})
        console.log(phone.value, res)
        renderMobileCode()
        // renderMobileCode
    }
}

const renderMobileCode = () => {
    codeTimer.value = setTimeout(() => {
        codeTime.value--
        codeButton.data.text = `${codeTime.value}s后重新获取`
        if (codeTime.value < 0) {
            clearTimeout(codeTimer.value)
            codeButton.data = {
                text: '获取验证码',
                disabled: false
            }
            codeTime.value = 60
        } else {
            renderMobileCode()
        }
    }, 1000)
}

const onSubmit = values => {
    router.push({ name: 'Customer' })
    return false
    if (!agreement.value) {
        Toast.fail('请阅读并同意协议')
        return false
    }
    console.log(555555, values)
}
</script>

<style lang="scss" scoped>
.login {
    background: url('~@/assets/img/login-bg.png') no-repeat top / cover;
    &__body {
        background-color: white;
        border-radius: 20px 20px 0 0;
        margin: 0 12px;
        margin-top: 250px;
        padding: 40px 33px 47px 33px;
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
    .van-cell {
        display: flex;
        align-items: center;
        border-radius: 10px;
        height: 50px;
        padding: 0 15px;
        background-color: #f4f8fb;
        font-size: 16px;
    }
    .get-code {
        border: 0;
        padding: 0;
        width: 99px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 5px;
        background-color: white;
        font-size: var(--primary-text-size);
        position: absolute;
        right: -5px;
        top: -5px;
    }
    .submit-button {
        background-color: var(--primary-active-text-color);
        margin-top: 23px;
        line-height: 45px;
        height: 45px;
        color: white;
        font-size: 15px;
        border-radius: 10px;
        border: 0;
    }
    .agreement-input {
        position: absolute;
        left: 0;
        bottom: 0;
        height: auto;
        background-color: transparent;
        padding: 0;
        font-size: var(--primary-text-size);
        :deep(.van-field__control) {
            justify-content: center;
        }
        :deep(.van-checkbox__icon) {
            display: inline-flex;
            align-items: center;
        }
        .img-icon {
            height: 12px;
        }
        :deep(.van-checkbox__label) {
            color: #b7b7b7;
            margin-left: 7px;
        }
        a {
            color: var(--primary-active-text-color);
        }
    }
}
</style>
