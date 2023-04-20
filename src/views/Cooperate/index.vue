<template>
    <div class="operator-page">
        <NavBar title="与联通合作相关信息" left-arrow />
        <div class="body-container operator-page__body">
            <Form @submit="onSubmit">
                <div class="form-wrap">
                    <Field name="unicomContractUrls" label="集团客户服务合同" class="custom-wrap item">
                        <template #input>
                            <div class="upload-container">
                                <h3>贵司与联通关键合同页面（3-6张）</h3>
                                <div class="flex justify-between flex-wrap upload-list">
                                    <div class="upload-item">
                                        <Uploader v-model="formData.data.unicomContractUrls" :after-read="afterRead">
                                            <div class="flex items-center justify-center h-full">
                                                <div class="flex flex-col items-center">
                                                    <Icon :name="addIcon" />
                                                </div>
                                            </div>
                                        </Uploader>
                                    </div>
                                    <div class="upload-item">
                                        <Uploader v-model="formData.data.unicomContractUrls" :after-read="afterRead">
                                            <div class="flex items-center justify-center h-full">
                                                <div class="flex flex-col items-center">
                                                    <Icon :name="addIcon" />
                                                </div>
                                            </div>
                                        </Uploader>
                                    </div>
                                    <div class="upload-item">
                                        <Uploader v-model="formData.data.unicomContractUrls" :after-read="afterRead">
                                            <div class="flex items-center justify-center h-full">
                                                <div class="flex flex-col items-center">
                                                    <Icon :name="addIcon" />
                                                </div>
                                            </div>
                                        </Uploader>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Field>
                    <Field
                        :value="formData.data.unicomProvince"
                        :right-icon="inactiveIcon"
                        readonly
                        clickable
                        label="归属联通省公司"
                        name="unicomProvince"
                        placeholder="请输入归属联通省公司"
                        class="select-wrap"
                        @click="showPicker = true"
                    />
                    <Field
                        v-model="formData.data.unicomManagerNumber"
                        name="unicomManagerNumber"
                        label="客户经理工号"
                        placeholder="请输入客户经理工号"
                    />
                    <Field
                        v-model="formData.data.unicomManagerName"
                        name="unicomManagerName"
                        label="客户经理姓名"
                        placeholder="请输入客户经理姓名"
                    />
                    <Field
                        v-model="formData.data.unicomManagerPhone"
                        name="unicomManagerPhone"
                        label="客户经理联系方式"
                        placeholder="请输入客户经理联系方式"
                    />
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
import addIcon from '@/assets/icon/add-icon.png'

// 社保缴纳方式：1-公司自缴 2-三方机构代办
const columns = ref(['该企业的法人代表', '该企业的经办人'])
const formData = reactive({
    data: {
        unicomContractUrls: [],
        unicomProvince: '',
        unicomManagerNumber: '',
        unicomManagerName: '',
        unicomManagerPhone: ''
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
            &.custom-wrap.item {
                .van-field__label {
                    margin-bottom: 0;
                }
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
        &.item {
            .van-field__control,
            .upload-list {
                height: auto;
            }
        }
        // .van-field__control {
        //     height: 173px;
        //     border-radius: 5px;
        //     justify-content: center;
        //     .van-icon__image {
        //         width: 20px;
        //         height: 20px;
        //     }
        //     .normal-text {
        //         color: #9ea3ac;
        //         font-size: 13px;
        //         margin-top: 13px;
        //         line-height: 13px;
        //     }
        //     .van-uploader {
        //         background-color: #f3f7ff;
        //     }
        // }
    }
}
</style>
