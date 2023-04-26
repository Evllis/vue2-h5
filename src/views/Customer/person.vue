<template>
    <div class="person-page">
        <NavBar title="企业经办人信息" left-arrow />
        <div class="body-container person-page__body">
            <Form @submit="onSubmit" ref="formRef">
                <div class="form-wrap pt-25px">
                    <Field
                        label="您是该企业的经办人，需要额外提供以下资料："
                        class="custom-wrap"
                        :rules="rules.corporateEmpower"
                        name="corporateEmpower"
                    >
                        <template #input>
                            <div class="flex-1 h-full custom-upload">
                                <Uploader
                                    v-model="corporateEmpower"
                                    name="corporateEmpower"
                                    :after-read="afterRead"
                                    @delete="deleteRead"
                                >
                                    <div
                                        v-show="!formData.data.corporateEmpower.length"
                                        class="flex items-center justify-center h-full"
                                    >
                                        <div class="flex flex-col items-center">
                                            <Icon :name="cameraIcon" />
                                            <span class="normal-text">点击上传法人授权书</span>
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                        </template>
                    </Field>
                    <Field label="经办人证件" class="custom-wrap card">
                        <template #input>
                            <Field
                                class="flex-1 h-full custom-upload m-0"
                                name="operatorIdFront"
                                :rules="rules.operatorIdFront"
                            >
                                <template #input>
                                    <Uploader
                                        v-model="operatorIdFront"
                                        name="operatorIdFront"
                                        :after-read="afterRead"
                                        @delete="deleteRead"
                                        class="mr-15px"
                                    >
                                        <div
                                            v-show="!formData.data.operatorIdFront.length"
                                            class="flex items-center justify-center h-full"
                                        >
                                            <div class="flex flex-col items-center">
                                                <Icon :name="cardFront" />
                                                <span class="normal-text">点击上传身份证人像面</span>
                                            </div>
                                        </div>
                                    </Uploader>
                                </template>
                            </Field>
                            <Field
                                class="flex-1 h-full custom-upload m-0"
                                name="operatorIdBack"
                                :rules="rules.operatorIdBack"
                            >
                                <template #input>
                                    <Uploader
                                        v-model="operatorIdBack"
                                        name="operatorIdBack"
                                        :after-read="afterRead"
                                        @delete="deleteRead"
                                        class="mr-15px"
                                    >
                                        <div
                                            v-show="!formData.data.operatorIdBack.length"
                                            class="flex items-center justify-center h-full"
                                        >
                                            <div class="flex flex-col items-center">
                                                <Icon :name="cardBack" />
                                                <span class="normal-text">点击上传身份证国徽面</span>
                                            </div>
                                        </div>
                                    </Uploader>
                                </template>
                            </Field>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.operatorName"
                        name="operatorName"
                        label="经办人姓名"
                        placeholder="请输入经办人姓名"
                        @change="changeValidate('operatorName')"
                        :rules="rules.operatorName"
                    />
                    <Field
                        v-model="formData.data.operatorId"
                        name="operatorId"
                        label="经办人身份证号"
                        placeholder="请输入经办人身份证号"
                        @change="changeValidate('operatorId')"
                        :rules="rules.operatorId"
                    />
                    <Field
                        v-model="formData.data.operatorPhone"
                        name="operatorPhone"
                        label="经办人联系方式"
                        placeholder="请输入经办人联系方式"
                        @change="changeValidate('operatorPhone')"
                        :rules="rules.operatorPhone"
                    />
                </div>
                <div class="flex submit-footer">
                    <VanButton
                        block
                        type="info"
                        native-type="button"
                        class="submit-button mr-10px"
                        to="/customer/enterprise"
                        >上一步</VanButton
                    >
                    <VanButton block :disabled="submitDisabled" type="info" native-type="submit" class="submit-button"
                        >下一步</VanButton
                    >
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Uploader, Icon } from 'vant'
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import { isIdCard, isName, isPhone } from '@/utils/validate'
import { isEmpty } from 'lodash-es'
import router from '@/router'
import { useCache } from '@/hooks/useCache'

import { uploadFile } from '@/api/common'
import { submitEnterpriseOperator, findEnterpriseOperator } from '@/api/customer'

import cameraIcon from '@/assets/icon/camera-icon.png'
import cardFront from '@/assets/img/card-front.png'
import cardBack from '@/assets/img/card-back.png'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const formRef = ref()
const submitDisabled = ref(true)
const operatorIdFront = ref([])
const corporateEmpower = ref([])
const operatorIdBack = ref([])
const formData = reactive({
    data: {
        corporateEmpower: '',
        operatorIdFront: '',
        operatorIdBack: '',
        operatorName: '',
        operatorId: '',
        operatorPhone: ''
    }
})

const rules = reactive({
    corporateEmpower: [
        {
            validator: () => {
                if (!formData.data.corporateEmpower || !formData.data.corporateEmpower.length) {
                    return false
                }
                return true
            },
            message: '请上传法人授权书'
        }
    ],
    operatorIdFront: [
        {
            validator: () => {
                if (!formData.data.operatorIdFront || !formData.data.operatorIdFront.length) {
                    return false
                }
                return true
            },
            message: '请上传身份证人像面'
        }
    ],
    operatorIdBack: [
        {
            validator: () => {
                if (!formData.data.operatorIdBack || !formData.data.operatorIdBack.length) {
                    return false
                }
                return true
            },
            message: '请上传身份证国徽面'
        }
    ],
    operatorName: [
        { required: true, message: '请填写经办人姓名' },
        { validator: isName, message: '请输入正确的经办人姓名' }
    ],
    operatorId: [
        { required: true, message: '请填写经办人身份证号' },
        { validator: isIdCard, message: '请输入正确的经办人身份证号' }
    ],
    operatorPhone: [
        { required: true, message: '请填写经办人联系方式' },
        { validator: isPhone, message: '请输入正确的经办人联系方式' }
    ]
})

const changeValidate = () => {
    formRef.value
        .validate()
        .then(async () => {
            submitDisabled.value = false
        })
        .catch(() => {
            submitDisabled.value = true
        })
}

const afterRead = async (file, details) => {
    file.status = 'uploading'
    file.message = '上传中...'
    try {
        const res = await uploadFile({
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                file: file.file
            },
            hideloading: true
        })
        if (!isEmpty(res.data)) {
            file.status = 'done'
            file.message = '上传完成'
            formData.data[details.name] = res.data[0]
            changeValidate()
        }
    } catch (err) {
        file.status = 'failed'
        file.message = '上传失败'
        changeValidate()
    }
}

const deleteRead = (file, details) => {
    formData.data[details.name] = ''
    changeValidate()
}

const onSubmit = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        formData.data['enterpriseId'] = enterpriseId
        try {
            await submitEnterpriseOperator({
                data: formData.data
            })
            setTimeout(() => router.push({ name: 'Operator' }), 1500)
        } catch (err) {
            return false
        }
    } else {
        $toast.fail({
            message: '请重新登录',
            onClose: () => {
                router.push({ name: 'Login' })
            }
        })
    }
}

onMounted(async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        try {
            const res = await findEnterpriseOperator({
                data: {
                    enterpriseId
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                formData.data = res.data
                corporateEmpower.value = res.data.corporateEmpower
                    ? [{ url: `https://${res.data.corporateEmpower}` }]
                    : []
                operatorIdFront.value = res.data.operatorIdFront ? [{ url: `https://${res.data.operatorIdFront}` }] : []
                operatorIdBack.value = res.data.operatorIdBack ? [{ url: `https://${res.data.operatorIdBack}` }] : []
                changeValidate()
            }
        } catch (err) {
            return false
        }
    }
})
</script>
