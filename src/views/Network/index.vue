<template>
    <div class="network-page">
        <NavBar title="合同预填写" left-arrow right-text="新增" />
        <div class="body-container network-page__body">
            <div class="van-form">
                <div class="form-wrap">
                    <h3 class="fs-13">入网清单</h3>
                    <div class="scroll-wrap">
                        <ul class="package-list">
                            <li class="package-item">
                                <div class="flex items-center package-body">
                                    <div class="flex-1 flex flex-col package-wrap">
                                        <div class="flex package-info">
                                            <span>冰激凌199套餐</span>
                                            <span>199元/月</span>
                                            <span>24期</span>
                                        </div>
                                        <div class="text-[var(--primary-active-color)]">
                                            <span>电子券109元</span>
                                            <span>办理数量x9999</span>
                                        </div>
                                    </div>
                                    <div class="package-opts">
                                        <VanButton
                                            plain
                                            type="primary"
                                            native-type="button"
                                            color="var(--primary-active-color)"
                                            >编辑</VanButton
                                        >
                                    </div>
                                </div>
                                <div class="package-desc">2023年3月入网</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button mr-10px">上一步</VanButton>
                    <VanButton block type="info" native-type="submit" class="submit-button" @click="showPicker = true"
                        >新增套餐信息</VanButton
                    >
                </div>
                <Popup v-model="showPicker" position="bottom" get-container="#app">
                    <Form @submit="onSubmit">
                        <Field
                            v-model="packageData.data.name"
                            name="name"
                            label="套餐名称"
                            placeholder="请输入套餐名称"
                        />
                        <Field
                            v-model="packageData.data.number"
                            name="number"
                            label="办理数量"
                            placeholder="请输入办理数量"
                        />
                        <Field
                            v-model="packageData.data.monthlyPayment"
                            name="monthlyPayment"
                            label="月套餐费用(元)"
                            placeholder="请输入月套餐费用(元)"
                        />
                        <Field
                            v-model="packageData.data.period"
                            name="period"
                            label="合约期"
                            placeholder="请输入合约期"
                        />
                        <Field
                            v-model="packageData.data.voucherAmount"
                            name="voucherAmount"
                            label="定向电子券金额(元)"
                            placeholder="请输入定向电子券金额(元)"
                        />
                        <Field
                            v-model="packageData.data.tradeTime"
                            name="tradeTime"
                            label="入网日期"
                            placeholder="请输入入网日期"
                        />
                        <div class="submit-footer">
                            <VanButton block disabled type="info" native-type="submit" class="submit-button"
                                >确定</VanButton
                            >
                        </div>
                    </Form>
                </Popup>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, Picker, Uploader, Icon } from 'vant'
import { reactive, ref } from 'vue'

import inactiveIcon from '@/assets/icon/select-icon.png'
import addIcon from '@/assets/icon/add-icon.png'

const packageData = reactive({
    data: {
        enterpriseId: '', // 企业id
        name: '', // 套餐名称
        number: '', // 办理数量
        monthlyPayment: '', // 月套餐费用(元)
        period: '', // 合约期
        voucherAmount: '', // 定向电子券金额(元)
        tradeTime: '' // 入网时间
    }
})
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
.network-page {
    background-color: #f8f8f8;
    &__body {
        padding-top: 25px;
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
