<template>
    <div class="operator-page">
        <NavBar title="企业门头/社保信息" left-arrow />
        <div class="body-container operator-page__body">
            <Form @submit="onSubmit" ref="formRef" class="pt-25px">
                <div class="form-wrap">
                    <Field label="门头照片" class="custom-wrap">
                        <template #input>
                            <div class="flex-1 h-full custom-upload">
                                <Uploader
                                    v-model="doorHeadPhoto"
                                    :after-read="afterRead"
                                    @delete="deleteRead"
                                    name="doorHeadPhoto"
                                >
                                    <div
                                        v-show="!formData.data.doorHeadPhoto.length"
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
                    <div class="mb-25px custom-label-container">
                        <h3 class="custom-label">社保缴纳方式</h3>
                        <div id="drop-container" class="drop-container">
                            <DropdownMenu>
                                <DropdownItem
                                    v-model="formData.data.socialSecurityType"
                                    :options="columns"
                                    get-container="#drop-container"
                                ></DropdownItem>
                            </DropdownMenu>
                        </div>
                    </div>
                    <Field
                        v-model="formData.data.socialSecurityNumber"
                        name="socialSecurityNumber"
                        label="社保缴纳人数"
                        placeholder="请输入社保缴纳人数"
                        class="!mb-0"
                        :formatter="formatterNumber"
                        :rules="[{ required: true, message: '请填写社保缴纳人数' }]"
                        @change="changeValidate('socialSecurityNumber')"
                    />
                    <div class="upload-container">
                        <h3>最近连续6个月内社保缴纳截图（3-6张）</h3>
                        <Uploader
                            v-model="socialSecurityUrls"
                            :after-read="afterRead"
                            :max-count="6"
                            :upload-icon="addIcon"
                            @delete="deleteRead"
                            name="socialSecurityUrls"
                        />
                    </div>
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button mr-10px">上一步</VanButton>
                    <VanButton block :disabled="submitDisabled" type="info" native-type="submit" class="submit-button"
                        >下一步</VanButton
                    >
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app">
                    <Picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
                </Popup>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, Picker, Uploader, Icon, DropdownMenu, DropdownItem } from 'vant'
import { reactive, ref, getCurrentInstance } from 'vue'
import { isEmpty } from 'lodash-es'
import router from '@/router'

import { uploadFile } from '@/api/common'
import { submitEnterpriseSocialSecurity } from '@/api/customer'

import cameraIcon from '@/assets/icon/camera-icon.png'
import addIcon from '@/assets/icon/add-icon.png'

const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const submitDisabled = ref(true)
const formRef = ref()
const doorHeadPhoto = ref([])
const socialSecurityUrls = ref([])
// 社保缴纳方式：1-公司自缴 2-三方机构代办
const formData = reactive({
    data: {
        doorHeadPhoto: [],
        socialSecurityType: '1',
        socialSecurityNumber: '',
        socialSecurityUrls: []
    }
})
const showPicker = ref(false)
const columns = ref([
    { text: '公司自缴', value: '1' },
    { text: '三方机构代办', value: '2' }
])

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
            if (details.name !== 'socialSecurityUrls') {
                formData.data[details.name] = res.data[0]
            } else {
                socialSecurityUrls.value[socialSecurityUrls.value.length - 1].imgUrl = res.data[0]
                formData.data[details.name] = socialSecurityUrls.value.map(item => item.imgUrl)
            }
            updateSubmitButton()
        }
    } catch (err) {
        file.status = 'failed'
        file.message = '上传失败'
        updateSubmitButton()
    }
}

const updateSubmitButton = () => {
    let status = true
    for (const key in formData.data) {
        if (!formData.data[key].length) {
            status = false
            break
        }
        if (key === 'socialSecurityUrls' && formData.data[key].length < 3) {
            status = false
            break
        }
    }
    submitDisabled.value = !status
}

const changeValidate = type => {
    formRef.value
        .validate(type)
        .then(async () => {
            updateSubmitButton()
        })
        .catch(() => {
            updateSubmitButton()
        })
}

const deleteRead = (file, details) => {
    formData.data[details.name] =
        details.name !== 'socialSecurityUrls' ? '' : socialSecurityUrls.value.map(item => item.imgUrl)
    updateSubmitButton()
}

const onConfirm = val => {
    formData.data.industryType = val
    showPicker.value = false
}

const onSubmit = async () => {
    // const enterpriseId = $store.getters.enterpriseId
    const enterpriseId = '1650026719275147264'
    if (enterpriseId) {
        // formData.data['enterpriseId'] = $store.getters.enterpriseId
        formData.data['enterpriseId'] = enterpriseId
        try {
            await submitEnterpriseSocialSecurity({
                data: formData.data
            })
            setTimeout(() => router.push({ name: 'Cooperate' }), 1500)
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

/**
 * formatter
 */
const formatterNumber = value => value.replace(/[^\d]/g, '')
</script>
