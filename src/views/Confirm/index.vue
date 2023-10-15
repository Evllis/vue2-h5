<template>
    <div class="confirm-page">
        <NavBar title="签收确认单" left-arrow @click-left="backRouter" />
        <div class="body-container confirm-page__body">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <Field :rules="rules.confirmImage" class="custom-wrap mb-20px" name="confirmImage">
                        <template #input>
                            <div class="flex-1 h-full custom-upload">
                                <Uploader v-model="confirmImage" name="confirmImage">
                                    <div v-show="!confirmImage.length" class="flex items-center justify-center h-full">
                                        <div class="flex flex-col items-center">
                                            <Icon :name="cameraIcon" />
                                            <span class="normal-text">点击上传您的签收单</span>
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                        </template>
                    </Field>
                    <div>
                        <VanButton block type="info" native-type="submit" class="submit-button" :loading="loading"
                            >上传</VanButton
                        >
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import { NavBar, Form, Field, Uploader, Icon } from 'vant'
import router from '@/router'

import { uploadFile } from '@/api/common'
import { submitConsigneeConfirm } from '@/api/confirm'

import cameraIcon from '@/assets/icon/camera-icon.png'

const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const formRef = ref()
const confirmImage = ref([])
const enterpriseId = ref('')
const enterpriseName = ref('')
const loading = ref(false)

const rules = reactive({
    confirmImage: [{ required: true, message: '请上传签收确认单' }]
})

const backRouter = () => {
    router.push({ name: 'List' })
}

const onSubmit = async () => {
    loading.value = true
    formRef.value
        .validate()
        .then(async () => {
            try {
                const uploadRes = await uploadFile({
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: {
                        file: confirmImage.value[0].file
                    },
                    hideloading: true
                })
                await submitConsigneeConfirm({
                    data: {
                        enterpriseId: enterpriseId.value,
                        name: enterpriseName.value,
                        consigneeConfirm: uploadRes.data[0]
                    }
                })
                loading.value = false
                $toast.success({
                    message: '签收确认单上传成功',
                    duration: 0
                })
            } catch (err) {
                loading.value = false
                $toast.fail({
                    message: '签收确认单上传失败'
                })
                return false
            }
        })
        .catch(() => {
            loading.value = false
        })
}

onMounted(() => {
    enterpriseId.value = $store.getters['app/enterpriseId'] || ''
    enterpriseName.value = $store.getters['app/enterpriseName'] || ''
})
</script>

<style lang="scss" scoped>
.confirm-page {
    :deep(.van-cell .van-field__body)::after {
        display: none;
    }
}
</style>
