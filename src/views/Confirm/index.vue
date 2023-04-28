<template>
    <div class="confirm-page">
        <NavBar title="收货确认单" :left-arrow="false" :style="{ paddingLeft: '15px' }" />
        <div class="body-container confirm-page__body">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <Field label="收货确认单" :rules="rules.confirmImage" class="custom-wrap" name="confirmImage">
                        <template #input>
                            <div class="flex-1 h-full custom-upload">
                                <Uploader v-model="confirmImage" name="confirmImage">
                                    <div v-show="!confirmImage.length" class="flex items-center justify-center h-full">
                                        <div class="flex flex-col items-center">
                                            <Icon :name="cameraIcon" />
                                            <span class="normal-text">点击上传收货确认单</span>
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                        </template>
                    </Field>
                </div>
                <div class="submit-footer">
                    <VanButton block type="info" native-type="submit" class="submit-button">提交</VanButton>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive } from 'vue'
import { NavBar, Form, Field, Uploader, Icon } from 'vant'

import { uploadFile } from '@/api/common'

import cameraIcon from '@/assets/icon/camera-icon.png'

const instance = getCurrentInstance()
const { $toast } = instance.proxy

const formRef = ref()
const confirmImage = ref([])

const rules = reactive({
    confirmImage: [{ required: true, message: '请上传收货确认单' }]
})

const onSubmit = async () => {
    formRef.value
        .validate()
        .then(async () => {
            try {
                await uploadFile({
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: {
                        file: confirmImage.value[0].file
                    },
                    hideloading: true
                })
                $toast.success({
                    message: '收货确认单上传成功',
                    duration: 0
                })
            } catch (err) {
                $toast.fail({
                    message: '收货确认单上传失败'
                })
                return false
            }
        })
        .catch(() => {})
}
</script>
