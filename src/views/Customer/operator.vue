<template>
    <div class="operator-page">
        <NavBar title="企业门头/社保信息" left-arrow />
        <div class="operator-page__body">
            <Form @submit="onSubmit">
                <div class="form-wrap">
                    <Field name="doorHeadPhoto" label="门头照片" class="custom-wrap">
                        <template #input>
                            <Uploader v-model="formData.data.doorHeadPhoto" :after-read="afterRead">
                                <div class="flex items-center justify-center h-full">
                                    <div class="flex flex-col items-center">
                                        <Icon :name="cameraIcon" />
                                        <span class="normal-text">点击上传法人授权书</span>
                                    </div>
                                </div>
                            </Uploader>
                        </template>
                    </Field>
                    <Field
                        :value="formData.data.socialSecurityType"
                        :right-icon="inactiveIcon"
                        readonly
                        clickable
                        label="社保缴纳方式"
                        name="socialSecurityType"
                        placeholder=""
                        class="select-wrap"
                        @click="showPicker = true"
                    />
                    <Field
                        v-model="formData.data.socialSecurityNumber"
                        name="socialSecurityNumber"
                        label="社保缴纳人数"
                        placeholder="请输入社保缴纳人数"
                        class="!mb-0"
                    />
                    <div class="upload-container">
                        <h3>最近连续6个月内社保缴纳截图（3-6张）</h3>
                        <div class="flex justify-between flex-wrap upload-list">
                            <div class="upload-item">
                                <Uploader v-model="formData.data.socialSecurityUrls" :after-read="afterRead">
                                    <div class="flex items-center justify-center h-full">
                                        <div class="flex flex-col items-center">
                                            <Icon :name="addIcon" />
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                            <div class="upload-item">
                                <Uploader v-model="formData.data.socialSecurityUrls" :after-read="afterRead">
                                    <div class="flex items-center justify-center h-full">
                                        <div class="flex flex-col items-center">
                                            <Icon :name="addIcon" />
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                            <div class="upload-item">
                                <Uploader v-model="formData.data.socialSecurityUrls" :after-read="afterRead">
                                    <div class="flex items-center justify-center h-full">
                                        <div class="flex flex-col items-center">
                                            <Icon :name="addIcon" />
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                            <div class="upload-item">
                                <Uploader v-model="formData.data.socialSecurityUrls" :after-read="afterRead">
                                    <div class="flex items-center justify-center h-full">
                                        <div class="flex flex-col items-center">
                                            <Icon :name="addIcon" />
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                            <div class="upload-item">
                                <Uploader v-model="formData.data.socialSecurityUrls" :after-read="afterRead">
                                    <div class="flex items-center justify-center h-full">
                                        <div class="flex flex-col items-center">
                                            <Icon :name="addIcon" />
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex submit-footer">
                    <VanButton block disabled type="info" native-type="button" class="submit-button mr-10px"
                        >上一步</VanButton
                    >
                    <VanButton block disabled type="info" native-type="submit" class="submit-button">下一步</VanButton>
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app">
                    <Picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
                </Popup>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, Picker, Uploader, Icon } from 'vant'
import { reactive, ref } from 'vue'

import inactiveIcon from '@/assets/icon/select-icon.png'
import cameraIcon from '@/assets/icon/camera-icon.png'
import addIcon from '@/assets/icon/add-icon.png'

// 社保缴纳方式：1-公司自缴 2-三方机构代办
const columns = ref(['该企业的法人代表', '该企业的经办人'])
const formData = reactive({
    data: {
        doorHeadPhoto: [],
        socialSecurityType: '公司自缴',
        socialSecurityNumber: '',
        socialSecurityUrls: []
    }
})
const showPicker = ref(false)

const afterRead = file => {
    // 此时可以自行将文件上传至服务器
    console.log(file)
    file.status = 'uploading'
    file.message = '上传中...'

    setTimeout(() => {
        file.status = 'failed'
        file.message = '上传失败'
    }, 1000)
}

const onConfirm = val => {
    formData.data.industryType = val
    showPicker.value = false
}

const onSubmit = values => {
    console.log(555555, values)
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.operator-page {
    &__body {
        padding-top: 25px;
        :deep(.van-cell) {
            flex-direction: column;
            padding: 0;
            margin-bottom: 25px;
            &:last-child {
                margin-bottom: 0;
            }
            .van-field__label {
                font-size: 13px;
                margin-right: 0;
                line-height: 13px;
                margin-bottom: 12px;
                width: 100%;
            }
            .van-field__body {
                font-size: 16px;
                padding-bottom: 15px;
                @include border-1px(bottom, #e5e5e5);
            }
            .van-field__control {
                height: 16px;
                line-height: 16px;
            }
        }
        .form-wrap {
            padding: 0 15px;
            padding-bottom: 30px;
        }
        .submit-footer {
            padding: 18px 32px 39px 32px;
            box-shadow: 0px -2px 6px 0px rgba(227, 227, 227, 0.5);
            .submit-button {
                width: 100%;
                height: 43px;
                border-radius: 8px;
                color: white;
                font-size: 15px;
                border: 0;
                background-color: var(--primary-active-color);
                &:disabled {
                    background-color: #ffccae;
                }
            }
        }
    }
    :deep(.van-cell.custom-wrap) {
        &.card {
            .van-field__control {
                height: 108px;
                .van-icon__image {
                    width: 95px;
                    height: 62px;
                }
                .normal-text {
                    margin-top: 9px;
                    font-size: 12px;
                }
            }
        }
        .van-field__control {
            height: 173px;
            border-radius: 5px;
            justify-content: center;
            .van-icon__image {
                width: 20px;
                height: 20px;
            }
            .normal-text {
                color: #9ea3ac;
                font-size: 13px;
                margin-top: 13px;
                line-height: 13px;
            }
            .van-uploader {
                background-color: #f3f7ff;
            }
        }
    }
}
</style>
