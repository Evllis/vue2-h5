<template>
    <div class="flex login">
        <div class="flex-1 relative login__body">
            <div class="flex items-center justify-center login__body-mask">
                <h1 class="text-[var(--primary-active-color)]">登录注册</h1>
            </div>
            <Form @submit="onSubmit" class="relative h-full" ref="formRef">
                <Field
                    v-model="phone"
                    type="tel"
                    name="phone"
                    label=""
                    placeholder="请输入手机号码"
                    class="mb-15px flex-row error-pos"
                    :rules="rules.phone"
                />
                <Field
                    v-model="code"
                    type="digit"
                    name="code"
                    label=""
                    placeholder="请输入验证码"
                    maxlength="6"
                    class="flex-row error-pos"
                    :rules="rules.code"
                >
                    <template #button>
                        <VanButton
                            :disabled="codeButton.data.disabled"
                            @click="getCode"
                            native-type="button"
                            class="text-[var(--primary-active-color)] get-code"
                            >{{ codeButton.data.text }}</VanButton
                        >
                    </template>
                </Field>
                <Field name="agreement" class="w-full m-0 agreement-input">
                    <template #input>
                        <VanCheckbox v-model="agreement" checked-color="var(--primary-active-color)" label-disabled>
                            <template #icon>
                                <img class="img-icon" :src="agreement ? activeIcon : inactiveIcon" />
                            </template>
                            <template #default>
                                我已阅读并同意
                                <span @click="show = true">《信息授权协议》</span>
                            </template>
                        </VanCheckbox>
                    </template>
                </Field>
                <div>
                    <VanButton block type="info" native-type="submit" class="submit-button">登录/注册</VanButton>
                </div>
            </Form>
        </div>
        <Popup
            v-model="show"
            position="right"
            closeable
            :style="{ width: '100%', height: '100%' }"
            get-container="#app"
        >
            <Agreement />
        </Popup>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { Form, Field, Popup } from 'vant'
import { isPhone, digitInteger } from '@/utils/validate'
import { useRouter } from 'vue-router/composables'
import { isEmpty } from 'lodash-es'
import { stepMap } from '@/store/config'
// import { useCache } from '@/hooks/useCache'

import Agreement from '@/components/Agreement'

import { sendMsg, loginRegister } from '@/api/login'

import inactiveIcon from '@/assets/icon/checkbox-icon.png'
import activeIcon from '@/assets/icon/checkbox-checked-icon.png'

const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy
// const { wsCache } = useCache()

const formRef = ref()
const router = useRouter()
const rules = reactive({
    phone: [
        { required: true, message: '请填写手机号' },
        { validator: isPhone, message: '请输入正确的手机号' }
    ],
    code: [
        { required: true, message: '请填写验证码' },
        { validator: digitInteger, message: '请输入正确的验证码' }
    ]
})
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
const show = ref(false)

// result
const resultPhoneCode = ref('')

// 获取手机验证码
const getCode = () => {
    formRef.value
        .validate('phone')
        .then(async () => {
            const res = await sendMsg({ phone: phone.value }).catch(() => {})
            if (!isEmpty(res) && +res.returnCode === 1000) {
                $toast.success('发送成功')
                codeButton.data.disabled = true
                resultPhoneCode.value = res.data || ''
                renderMobileCode()
                return false
            }
            res.returnMsg || $toast.fail(res.returnMsg)
        })
        .catch(() => {})
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

const onSubmit = async values => {
    if (!agreement.value) {
        $toast('请阅读并同意协议')
        return false
    }
    try {
        const res = await loginRegister({ phone: phone.value, code: '000000' }).catch(() => {})
        if (!isEmpty(res)) {
            // wsCache.set('token', res.data.token)
            $store.dispatch('setToken', res.data.token)
            let routerName = 'Customer'
            if (res.data.step) {
                routerName = stepMap.value[res.data.step]
                $store.dispatch('setStep', res.data.step)
            }
            if (res.data.role) {
                $store.dispatch('setRole', res.data.role)
            }
            if (res.data.enterpriseId) {
                $store.dispatch('setEnterpriseId', res.data.enterpriseId)
            }
            setTimeout(() => router.push({ name: routerName }), 1000)
        }
    } catch (err) {
        return false
    }
    console.log(values)
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
    :deep(.van-cell) {
        display: flex;
        align-items: center;
        border-radius: 10px;
        height: 50px;
        padding: 0 15px;
        background-color: #f4f8fb;
        font-size: 16px;
        .van-field__body {
            padding-bottom: 0;
            &::after {
                display: none;
            }
        }
        .van-field__control {
            line-height: inherit;
        }
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
        background-color: var(--primary-active-color);
        margin-top: 23px;
        line-height: 45px;
        height: 45px;
        color: white;
        font-size: 15px;
        border-radius: 10px;
        border: 0;
        letter-spacing: 1px;
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
            font-size: 12px;
        }
        span {
            color: var(--primary-active-color);
        }
    }
}
</style>
