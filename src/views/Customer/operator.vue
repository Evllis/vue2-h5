<template>
    <div class="operator-page">
        <NavBar title="企业门头/社保信息" left-arrow @click-left="backRouter" />
        <div class="body-container operator-page__body">
            <Form
                @submit="onSubmit"
                ref="formRef"
                :validate-first="true"
                :validate-trigger="'onSubmit'"
                class="pt-25px"
            >
                <div class="form-wrap">
                    <Field class="custom-wrap" :rules="rules.doorHeadPhoto" name="doorHeadPhoto">
                        <template #label>
                            <div class="flex items-center justify-between">
                                <span>门头照片</span>
                                <span class="font-bold text-[var(--primary-active-color)]" @click="previewExample"
                                    >查看示例</span
                                >
                            </div>
                        </template>
                        <template #input>
                            <div class="flex-1 h-full custom-upload">
                                <Uploader
                                    v-model="doorHeadPhoto"
                                    name="doorHeadPhoto"
                                    :after-read="afterRead"
                                    @delete="deleteRead"
                                >
                                    <div
                                        v-show="!formData.data.doorHeadPhoto.length"
                                        class="flex items-center justify-center h-full"
                                    >
                                        <div class="flex flex-col items-center">
                                            <Icon :name="cameraIcon" />
                                            <span class="normal-text">点击上传您与门头合照</span>
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
                    <Field class="custom-wrap social-wrap" :rules="rules.socialSecurityUrls" name="socialSecurityUrls">
                        <template #input>
                            <div class="upload-container w-full h-full">
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
                        </template>
                    </Field>
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button mr-10px" @click="backRouter"
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
import { NavBar, Form, Field, Uploader, Icon, DropdownMenu, DropdownItem, ImagePreview } from 'vant'
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import { isEmpty } from 'lodash-es'
import router from '@/router'
import { useCache } from '@/hooks/useCache'

import { uploadFile } from '@/api/common'
import { submitEnterpriseSocialSecurity, findEnterpriseSocialSecurity } from '@/api/customer'

import cameraIcon from '@/assets/icon/camera-icon.png'
import addIcon from '@/assets/icon/add-icon.png'
import example from '@/assets/img/example.png'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const submitDisabled = ref(true)
const formRef = ref()
const doorHeadPhoto = ref([])
const socialSecurityUrls = ref([])
const formData = reactive({
    data: {
        doorHeadPhoto: [],
        socialSecurityType: '1',
        socialSecurityNumber: '',
        socialSecurityUrls: []
    }
})
const columns = ref([
    { text: '公司自缴', value: '1' },
    { text: '三方机构代办', value: '2' }
])
const rules = reactive({
    doorHeadPhoto: [
        {
            validator: () => {
                if (!formData.data.doorHeadPhoto || !formData.data.doorHeadPhoto.length) {
                    return false
                }
                return true
            },
            message: '请上传法人授权书'
        }
    ],
    socialSecurityUrls: [
        {
            validator: () => {
                if (!formData.data.socialSecurityUrls || formData.data.socialSecurityUrls.length < 3) {
                    return false
                }
                return true
            },
            message: '社保缴纳截图至少上传3张'
        }
    ]
})

const backRouter = () => {
    const name = wsCache.get('role') === '1' ? 'Enterprise' : 'Person'
    router.push({ name })
}

const previewExample = () => {
    ImagePreview([example])
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
            if (details.name !== 'socialSecurityUrls') {
                formData.data[details.name] = res.data[0]
            } else {
                socialSecurityUrls.value[socialSecurityUrls.value.length - 1].imgUrl = res.data[0]
                formData.data[details.name] = socialSecurityUrls.value.map(item => item.imgUrl)
            }
            changeValidate()
        }
    } catch (err) {
        file.status = 'failed'
        file.message = '上传失败'
        changeValidate()
    }
}

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

const deleteRead = (file, details) => {
    formData.data[details.name] =
        details.name !== 'socialSecurityUrls' ? '' : socialSecurityUrls.value.map(item => item.imgUrl)
    changeValidate()
}

const onSubmit = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        formData.data['enterpriseId'] = enterpriseId
        try {
            await submitEnterpriseSocialSecurity({
                data: formData.data
            })
            router.push({ name: 'Cooperate' })
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
            const res = await findEnterpriseSocialSecurity({
                data: {
                    enterpriseId
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                formData.data = res.data
                formData.data.socialSecurityType = `${formData.data.socialSecurityType}`
                doorHeadPhoto.value = res.data.doorHeadPhoto ? [{ url: `https://${res.data.doorHeadPhoto}` }] : []
                socialSecurityUrls.value = res.data.socialSecurityUrls
                    ? res.data.socialSecurityUrls.map(item => {
                          return {
                              url: `https://${item}`
                          }
                      })
                    : []
                changeValidate()
            }
        } catch (err) {
            return false
        }
    }
})

/**
 * formatter
 */
const formatterNumber = value => value.replace(/[^\d]/g, '')
</script>

<style lang="scss" scoped>
.operator-page {
    :deep(.upload-container) {
        & > .van-uploader {
            width: auto;
            height: auto;
            background-color: transparent;
        }
    }
    :deep(.social-wrap .van-field__body) {
        padding-bottom: 0;
        &::after {
            display: none;
        }
    }
}
</style>
