<template>
    <div class="preview-page">
        <NavBar title="协议预览" left-arrow />
        <div class="body-container preview-page__body">
            <Form @submit="onSubmit">
                <div class="form-wrap"></div>
                <div class="flex submit-footer">
                    <VanButton block disabled type="info" native-type="submit" class="submit-button">确定</VanButton>
                </div>
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
        firstPaymentSum: '', // 首付款合计(元)
        monthlyPaymentSum: '', // 月支付款合计(元)
        consigneeName: '', // 收货人姓名
        consigneePhone: '', // 收货人联系方式
        consigneeAddress: '' // 收货人地址
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
.preview-page {
    background-color: #f8f8f8;
    &__body {
        padding-top: 25px;
        background-color: white;
        .h3-title {
            font-size: 16px;
            line-height: 16px;
            font-weight: bold;
            margin-bottom: 25px;
        }
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
