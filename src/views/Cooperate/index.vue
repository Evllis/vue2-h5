<template>
    <div class="cooperate-page">
        <NavBar title="与联通合作相关信息" left-arrow @click-left="onClickLeft" />
        <div class="body-container cooperate-page__body">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <Field
                        class="custom-wrap social-wrap"
                        label="集团客户服务合同"
                        :rules="rules.unicomContractUrls"
                        name="unicomContractUrls"
                    >
                        <template #input>
                            <div class="upload-container w-full h-full">
                                <h3>贵司与联通关键合同页面（3-6张）</h3>
                                <Uploader
                                    v-model="unicomContractUrls"
                                    :after-read="afterRead"
                                    :max-count="6"
                                    :upload-icon="addIcon"
                                    @delete="deleteRead"
                                    name="unicomContractUrls"
                                />
                            </div>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.unicomProvince"
                        :right-icon="inactiveIcon"
                        label="归属联通省公司"
                        readonly
                        clickable
                        name="unicomProvince"
                        placeholder="请选择归属联通省公司"
                        class="select-wrap"
                        :rules="rules.unicomProvince"
                        @click="showPicker = true"
                    />
                    <Field
                        v-model="formData.data.unicomManagerNumber"
                        name="unicomManagerNumber"
                        label="客户经理工号"
                        placeholder="请输入客户经理工号"
                        :rules="rules.unicomManagerNumber"
                        @change="changeValidate('unicomManagerNumber')"
                    />
                    <Field
                        v-model="formData.data.unicomManagerName"
                        name="unicomManagerName"
                        label="客户经理姓名"
                        placeholder="请输入客户经理姓名"
                        :rules="rules.unicomManagerName"
                        @change="changeValidate('unicomManagerName')"
                    />
                    <Field
                        v-model="formData.data.unicomManagerPhone"
                        name="unicomManagerPhone"
                        label="客户经理联系方式"
                        placeholder="请输入客户经理联系方式"
                        :rules="rules.unicomManagerPhone"
                        @change="changeValidate('unicomManagerPhone')"
                    />
                </div>
                <div class="flex submit-footer">
                    <VanButton
                        block
                        type="info"
                        native-type="button"
                        class="submit-button mr-10px"
                        to="/customer/operator"
                        >上一步</VanButton
                    >
                    <VanButton block :disabled="submitDisabled" type="info" native-type="submit" class="submit-button"
                        >下一步</VanButton
                    >
                </div>
            </Form>
        </div>
        <Popup v-model="showPicker" position="bottom" get-container="#app">
            <Area :area-list="areaList.data" :columns-num="2" @confirm="onConfirm" @cancel="showPicker = false" />
            <!-- <Picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" /> -->
        </Popup>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, Area, Uploader } from 'vant'
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import router from '@/router'
import { useCache } from '@/hooks/useCache'

import { regionInfo, uploadFile } from '@/api/common'
import { submitEnterpriseUnicomInfo, findEnterpriseUnicomInfo } from '@/api/cooperate'

import { isLetterNumber, isName, isPhone } from '@/utils/validate'

import inactiveIcon from '@/assets/icon/select-icon.png'
import addIcon from '@/assets/icon/add-icon.png'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const formRef = ref()
const selectAreaData = ref([])
const showPicker = ref(false)
const unicomContractUrls = ref([])

const areaList = reactive({
    data: {
        province_list: {},
        city_list: {}
    }
})
const rules = reactive({
    unicomContractUrls: [
        {
            validator: () => {
                if (!formData.data.unicomContractUrls || formData.data.unicomContractUrls.length < 3) {
                    return false
                }
                return true
            },
            message: '关键合同页面至少上传3张'
        }
    ],
    unicomProvince: [{ required: true, message: '请填写归属联通省公司' }],
    unicomManagerNumber: [
        { required: true, message: '请填写客户经理工号' },
        { pattern: /^.{6,50}$/, message: '长度必须是6-50位' },
        { validator: isLetterNumber, message: '请输入正确的客户经理工号' }
    ],
    unicomManagerName: [
        { required: true, message: '请填写客户经理姓名' },
        { validator: isName, message: '请输入正确的客户经理姓名' }
    ],
    unicomManagerPhone: [
        { required: true, message: '请填写客户经理联系方式' },
        { validator: isPhone, message: '请输入正确的客户经理联系方式' }
    ]
})
const formData = reactive({
    data: {
        unicomContractUrls: [],
        unicomProvince: '',
        unicomManagerNumber: '',
        unicomManagerName: '',
        unicomManagerPhone: ''
    }
})
const submitDisabled = ref(true)

const onClickLeft = () => {
    router.push({ name: 'Operator' })
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
            unicomContractUrls.value[unicomContractUrls.value.length - 1].imgUrl = res.data[0]
            formData.data[details.name] = unicomContractUrls.value.map(item => item.imgUrl)
            changeValidate()
        }
    } catch (err) {
        file.status = 'failed'
        file.message = '上传失败'
        changeValidate()
    }
}

const deleteRead = (file, details) => {
    formData.data[details.name] = unicomContractUrls.value.map(item => item.imgUrl)
    changeValidate()
}

const onConfirm = val => {
    selectAreaData.value = val
    formData.data.unicomProvince = `${val[0].name} / ${val[1].name}`
    showPicker.value = false
    changeValidate()
}
const onSubmit = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        const data = Object.assign(formData.data, {
            enterpriseId,
            unicomProvinceCode: selectAreaData.value[0].code,
            unicomCity: selectAreaData.value[1].name,
            unicomCityCode: selectAreaData.value[1].code
        })
        data['unicomProvince'] = selectAreaData.value[0].name
        try {
            await submitEnterpriseUnicomInfo({
                data
            })
            setTimeout(() => router.push({ name: 'Network' }), 1500)
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

const backFillData = async () => {
    const enterpriseId = wsCache.get('enterpriseId')
    if (enterpriseId) {
        try {
            const res = await findEnterpriseUnicomInfo({
                data: {
                    enterpriseId
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                formData.data = res.data
                unicomContractUrls.value = res.data.unicomContractUrls
                    ? res.data.unicomContractUrls.map(item => {
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
}

onMounted(async () => {
    backFillData()
    try {
        const res = await regionInfo({
            hideloading: true
        })
        if (res && !isEmpty(res.data)) {
            res.data.forEach(item => {
                areaList.data.province_list[item.code] = item.name
                const childrenCity = {}
                item.child.forEach(elem => {
                    childrenCity[elem.code] = elem.name
                })
                areaList.data.city_list = Object.assign(areaList.data.city_list, childrenCity)
            })
        }
    } catch (err) {
        return false
    }
})
</script>

<style lang="scss" scoped>
.cooperate-page {
    :deep(.upload-container) {
        & > .van-uploader {
            width: auto;
            height: auto;
            background-color: transparent;
        }
    }
    :deep(.social-wrap .van-field__label) {
        margin-bottom: 0;
    }
}
</style>
