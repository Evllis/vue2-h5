<template>
    <div class="flex login">
        <div class="flex-1 relative login__body">
            <div class="flex items-center justify-center login__body-mask">
                <h1 class="text-[var(--primary-active-color)]">登录注册</h1>
            </div>
            <Form
                @submit="onSubmit"
                :validate-first="true"
                :validate-trigger="'onSubmit'"
                class="relative h-full"
                ref="formRef"
            >
                <Field
                    v-model="phone"
                    type="tel"
                    name="phone"
                    label=""
                    placeholder="请填写手机号"
                    class="mb-15px flex-row error-pos"
                    maxlength="11"
                    @input="validateInput"
                    :rules="rules.phone"
                    :formatter="phoneNumber"
                />
                <Field
                    v-model="code"
                    type="digit"
                    name="code"
                    label=""
                    placeholder="请填写验证码"
                    maxlength="6"
                    class="flex-row error-pos"
                    @input="validateInput"
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
                    <VanButton block type="info" native-type="submit" class="submit-button" :disabled="buttonDisabled"
                        >登录/注册</VanButton
                    >
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
        <VanDialog
            v-model="dialogShow"
            class="agreement-dialog"
            title="信息授权协议"
            show-cancel-button
            confirm-button-text="同意"
            cancel-button-text="不同意"
            :beforeClose="dialogClose"
        >
            <div>
                <p>
                    <span>在使用商企服务产品前，请仔细阅读</span>
                    <a href="javascript:void(0);" style="color: #ff5f01" @click="show = true">信息授权协议</a>。
                </p>
                <p>如您点击“同意”则代表您已阅读并同意上述条款，不同意则无法继续使用我们的产品。</p>
            </div>
        </VanDialog>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { Form, Field, Popup } from 'vant'
import { isPhone, digitInteger } from '@/utils/validate'
import { phoneNumber } from '@/utils/formatter'
import { isEmpty } from 'lodash-es'
import { stepMap } from '@/store/config'
import { useCache } from '@/hooks/useCache'
import router from '@/router'

import Agreement from '@/components/Agreement'

import { sendMsg, loginRegisterV2 } from '@/api/login'

import inactiveIcon from '@/assets/icon/checkbox-icon.png'
import activeIcon from '@/assets/icon/checkbox-checked-icon.png'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const formRef = ref()
const rules = reactive({
    phone: [
        { required: true, message: '请填写手机号' },
        { validator: isPhone, message: '手机号格式错误' }
    ],
    code: [
        { required: true, message: '请填写验证码' },
        { validator: digitInteger, message: '请填写正确的验证码' }
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
const dialogShow = ref(false)
const buttonDisabled = ref(true)

// 获取手机验证码
const getCode = () => {
    formRef.value
        .validate('phone')
        .then(async () => {
            const res = await sendMsg({ phone: phone.value }).catch(() => {})
            if (!isEmpty(res) && +res.returnCode === 1000) {
                $toast.success('发送成功')
                codeButton.data.disabled = true
                renderMobileCode()
                return false
            }
            res.returnMsg || $toast.fail(res.returnMsg)
        })
        .catch(() => {
            $toast.fail('发送失败, 请稍候再试~~')
        })
}

const dialogClose = (action, done) => {
    if (action === 'confirm') {
        agreement.value = true
    }
    done()
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

const validateInput = () => {
    if (phone.value && code.value) {
        buttonDisabled.value = false
    } else {
        buttonDisabled.value = true
    }
}

const onSubmit = async () => {
    if (!agreement.value) {
        dialogShow.value = true
        return false
    }
    try {
        const res = await loginRegisterV2({ phone: phone.value, code: code.value }).catch(() => {})
        if (!isEmpty(res)) {
            wsCache.clear()
            wsCache.set('token', res.data.token)
            let routerName = 'Customer'
            if (res.data.step) {
                /**
                 * TODO 临时修改为20, 测试客户列表
                 */
                res.data.step = '20'
                routerName = stepMap.value[res.data.step]
                wsCache.set('step', res.data.step)
            }
            if (res.data.customerId) {
                wsCache.set('customerId', res.data.customerId)
            }
            if (res.data.phone) {
                wsCache.set('phone', res.data.phone)
            }
            router.push({
                name: routerName
            })
            /**
             * TODO 临时跳转查看进度页面
             */
            // router.push({
            //     name: 'Process'
            // })
        }
    } catch (err) {
        return false
    }
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
        overflow: initial;
        &.error-pos {
            .van-field__error-message {
                position: absolute;
                top: 32px;
            }
        }
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
    :deep(.agreement-dialog) {
        .van-dialog__content {
            font-size: 14px;
            padding: 20px;
        }
        .van-dialog__footer {
            padding: 0 20px 25px 20px;
            &::after {
                display: none;
            }
            button {
                font-size: 15px;
                height: 43px;
                border-radius: 6px;
                &:first-child {
                    border: 1px solid #ff5f01;
                    color: #ff5f01;
                }
                &:last-child {
                    margin-left: 10px;
                    background-color: #ff5f01;
                    color: white;
                    &::after {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
