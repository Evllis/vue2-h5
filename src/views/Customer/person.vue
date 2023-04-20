<template>
    <div class="person-page">
        <NavBar title="企业经办人信息" left-arrow />
        <div class="body-container person-page__body">
            <Form @submit="onSubmit">
                <div class="form-wrap">
                    <Field
                        name="corporateEmpower"
                        label="您是该企业的经办人，需要额外提供以下资料："
                        class="custom-wrap"
                    >
                        <template #input>
                            <Uploader v-model="formData.data.corporateEmpower" :after-read="afterRead">
                                <div class="flex items-center justify-center h-full">
                                    <div class="flex flex-col items-center">
                                        <Icon :name="cameraIcon" />
                                        <span class="normal-text">点击上传法人授权书</span>
                                    </div>
                                </div>
                            </Uploader>
                        </template>
                    </Field>
                    <Field label="经办人证件" class="custom-wrap card">
                        <template #input>
                            <Uploader v-model="formData.data.operatorIdFront" :after-read="afterRead" class="mr-15px">
                                <div class="flex items-center justify-center h-full">
                                    <div class="flex flex-col items-center">
                                        <Icon :name="cardFront" />
                                        <span class="normal-text">点击上传身份证人像面</span>
                                    </div>
                                </div>
                            </Uploader>
                            <Uploader v-model="formData.data.operatorIdBack" :after-read="afterRead">
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
                        v-model="formData.data.operatorName"
                        name="operatorName"
                        label="经办人姓名"
                        placeholder="请输入经办人姓名"
                    />
                    <Field
                        v-model="formData.data.operatorId"
                        name="operatorId"
                        label="经办人身份证号"
                        placeholder="请输入经办人身份证号"
                    />
                    <Field
                        v-model="formData.data.operatorPhone"
                        name="operatorPhone"
                        label="经办人联系方式"
                        placeholder="请输入经办人联系方式"
                    />
                </div>
                <div class="flex submit-footer">
                    <VanButton block disabled type="info" native-type="button" class="submit-button mr-10px"
                        >上一步</VanButton
                    >
                    <VanButton block disabled type="info" native-type="submit" class="submit-button">下一步</VanButton>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Uploader, Icon } from 'vant'
import { reactive } from 'vue'

import cameraIcon from '@/assets/icon/camera-icon.png'
import cardFront from '@/assets/img/card-front.png'
import cardBack from '@/assets/img/card-back.png'

const formData = reactive({
    data: {
        corporateEmpower: [],
        operatorIdFront: [],
        operatorIdBack: [],
        operatorName: '',
        operatorId: '',
        operatorPhone: ''
    }
})

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

const onSubmit = values => {
    console.log(555555, values)
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.person-page {
    &__body {
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
