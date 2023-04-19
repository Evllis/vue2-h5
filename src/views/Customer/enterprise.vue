<template>
    <div class="enterprise-page">
        <NavBar title="企业基本信息" left-arrow />
        <div class="enterprise-page__body">
            <Form @submit="onSubmit">
                <div class="form-wrap">
                    <Field v-model="formData.data.name" name="name" label="企业名称" placeholder="请输入您的企业名称" />
                    <Field
                        v-model="formData.data.licenseNum"
                        name="licenseNum"
                        label="营业执照/社会信用代码"
                        placeholder="请输入您营业执照/社会信用代码"
                    />
                    <Field
                        :value="formData.data.industryType"
                        :right-icon="inactiveIcon"
                        readonly
                        clickable
                        label="行业类型"
                        name="industryType"
                        placeholder="请选择行业类型"
                        class="select-wrap"
                        @click="showPicker = true"
                    />
                    <Field name="businessLicense" label="营业执照" class="custom-wrap businessLicense">
                        <template #input>
                            <Uploader v-model="formData.data.businessLicense" :after-read="afterRead">
                                <div class="flex items-center justify-center h-full">
                                    <div class="flex flex-col items-center">
                                        <Icon :name="cameraIcon" />
                                        <span class="normal-text">点击上传照片</span>
                                    </div>
                                </div>
                            </Uploader>
                        </template>
                    </Field>
                    <Field label="法人证件" class="custom-wrap card">
                        <template #input>
                            <Uploader v-model="formData.data.corporateIdFront" :after-read="afterRead" class="mr-15px">
                                <div class="flex items-center justify-center h-full">
                                    <div class="flex flex-col items-center">
                                        <Icon :name="cardFront" />
                                        <span class="normal-text">点击上传身份证人像面</span>
                                    </div>
                                </div>
                            </Uploader>
                            <Uploader v-model="formData.data.corporateIdBack" :after-read="afterRead">
                                <div class="flex items-center justify-center h-full">
                                    <div class="flex flex-col items-center">
                                        <Icon :name="cardBack" />
                                        <span class="normal-text">点击上传身份证国徽面</span>
                                    </div>
                                </div>
                            </Uploader>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.corporateName"
                        name="corporateName"
                        label="法人姓名"
                        placeholder="请输入法人姓名"
                    />
                    <Field
                        v-model="formData.data.corporateId"
                        name="corporateId"
                        label="法人身份证号"
                        placeholder="请输入法人身份证号"
                    />
                    <Field
                        v-model="formData.data.corporatePhone"
                        name="corporatePhone"
                        label="法人联系方式"
                        placeholder="请输入法人联系方式"
                    />
                </div>
                <div class="submit-footer">
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
import cardFront from '@/assets/img/card-front.png'
import cardBack from '@/assets/img/card-back.png'

const columns = ref(['该企业的法人代表', '该企业的经办人'])
const formData = reactive({
    data: {
        name: '',
        licenseNum: '',
        industryType: '',
        businessLicense: [],
        corporateIdFront: [],
        corporateIdBack: [],
        corporateName: ''
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
.enterprise-page {
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
            .van-uploader,
            .van-uploader__wrapper,
            .van-uploader__input-wrapper {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
