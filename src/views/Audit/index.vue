<template>
    <div class="audit-page">
        <NavBar title="审核中" left-arrow />
        <!-- <NavBar title="审核失败" left-arrow /> -->
        <div class="body-container audit-page__body">
            <div class="flex flex-col items-center justify-center audit-wrap">
                <!-- <VanImage :src="auditIng" /> -->
                <VanImage :src="auditFail" />
                <p>您的授信审核已提交，预计T+1审核完成</p>
                <!-- <p>您司不符合准入标准，2023年9月29日 可再次提交审核</p> -->
                <!-- <VanButton block type="info" native-type="button" class="submit-button">确定</VanButton> -->
                <!-- <VanButton block type="info" native-type="button" class="submit-button">完成</VanButton> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Image as VanImage } from 'vant'

// import auditIng from '@/assets/img/audit-ing.png'
import auditFail from '@/assets/img/audit-fail.png'
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.audit-page {
    background-color: #f8f8f8;
    &__body {
        padding-top: 25px;
        background-color: white;
        .audit-wrap {
            margin-top: 95px;
        }
        :deep(.van-image__img) {
            width: 107px;
            height: auto;
        }
        p {
            width: 240px;
            text-align: center;
            margin-top: 19px;
            font-size: 14px;
            color: var(--primary-active-color);
        }
        .submit-button {
            width: 170px;
            height: 43px;
            border-radius: 8px;
            background-color: var(--primary-active-color);
            font-size: 15px;
            text-align: center;
            line-height: 43px;
            border: 0;
            margin-top: 24px;
        }
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
