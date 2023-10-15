<template>
    <div class="enterprise-page">
        <NavBar
            title="客户基本信息"
            :left-arrow="!editAudit"
            @click-left="onClickLeft"
            :style="{ paddingLeft: `${editAudit ? '15px' : ''}` }"
        />
        <div class="body-container enterprise-page__body">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
                    <Field
                        v-model="formData.data.name"
                        :rules="rules.name"
                        name="name"
                        label="企业名称"
                        placeholder="请输入您的企业名称"
                    />
                    <Field
                        v-model="formData.data.licenseNum"
                        :rules="rules.licenseNum"
                        name="licenseNum"
                        label="营业执照/社会信用代码"
                        placeholder="请输入您营业执照/社会信用代码"
                    />
                    <Field
                        v-model="formData.data.businessAddress"
                        :rules="rules.businessAddress"
                        name="businessAddress"
                        label="实际经营地址"
                        placeholder="请输入客户的实际经营地址"
                    />
                    <Field
                        v-model="formData.data.industryType"
                        :right-icon="inactiveIcon"
                        :rules="rules.industryType"
                        name="industryType"
                        label="行业类型"
                        placeholder="请选择行业类型"
                        class="select-cell"
                    >
                        <template #input>
                            <div id="drop-container" class="drop-container">
                                <div class="drop-placeholder" v-if="placeholderShow">请选择行业类型</div>
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="formData.data.industryType"
                                        :options="columns"
                                        get-container="#drop-container"
                                        @change="dropItemChange"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </template>
                    </Field>
                    <Field
                        label="营业执照"
                        class="custom-wrap businessLicense"
                        :rules="rules.businessLicense"
                        name="businessLicense"
                    >
                        <template #input>
                            <div class="flex-1 h-full custom-upload">
                                <Uploader
                                    v-model="businessLicense"
                                    name="businessLicense"
                                    :after-read="afterRead"
                                    @delete="deleteRead"
                                >
                                    <div
                                        v-show="!formData.data.businessLicense.length"
                                        class="flex items-center justify-center h-full"
                                    >
                                        <div class="flex flex-col items-center">
                                            <Icon :name="cameraIcon" />
                                            <span class="normal-text">点击上传照片</span>
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                        </template>
                    </Field>
                    <Field label="法人证件" class="custom-wrap card">
                        <template #input>
                            <Field
                                class="flex-1 h-full custom-upload m-0"
                                name="corporateIdFront"
                                :rules="rules.corporateIdFront"
                            >
                                <template #input>
                                    <Uploader
                                        v-model="corporateIdFront"
                                        name="corporateIdFront"
                                        :after-read="afterRead"
                                        @delete="deleteRead"
                                        class="mr-15px"
                                    >
                                        <div
                                            v-show="!formData.data.corporateIdFront.length"
                                            class="flex items-center justify-center h-full"
                                        >
                                            <div class="flex flex-col items-center">
                                                <Icon :name="cardFront" />
                                                <span class="normal-text">点击上传身份证人像面</span>
                                            </div>
                                        </div>
                                    </Uploader>
                                </template>
                            </Field>
                            <Field
                                class="flex-1 h-full custom-upload m-0"
                                name="corporateIdBack"
                                :rules="rules.corporateIdBack"
                            >
                                <template #input>
                                    <Uploader
                                        v-model="corporateIdBack"
                                        name="corporateIdBack"
                                        :after-read="afterRead"
                                        @delete="deleteRead"
                                        class="mr-15px"
                                    >
                                        <div
                                            v-show="!formData.data.corporateIdBack.length"
                                            class="flex items-center justify-center h-full"
                                        >
                                            <div class="flex flex-col items-center">
                                                <Icon :name="cardBack" />
                                                <span class="normal-text">点击上传身份证国徽面</span>
                                            </div>
                                        </div>
                                    </Uploader>
                                </template>
                            </Field>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.corporateName"
                        :rules="rules.corporateName"
                        name="corporateName"
                        label="法人姓名"
                        placeholder="请输入法人姓名"
                    />
                    <Field
                        v-model="formData.data.corporateId"
                        :rules="rules.corporateId"
                        name="corporateId"
                        label="法人身份证号"
                        placeholder="请输入法人身份证号"
                    />
                    <Field
                        v-model="formData.data.corporatePhone"
                        :rules="rules.corporatePhone"
                        :readonly="isDisabled"
                        :formatter="phoneNumber"
                        name="corporatePhone"
                        label="法人联系方式"
                        maxlength="11"
                        placeholder="请输入法人联系方式"
                    />
                </div>
                <div class="submit-footer">
                    <VanButton block type="info" native-type="submit" class="submit-button">{{
                        editAudit ? '提交' : '下一步'
                    }}</VanButton>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Uploader, Icon, DropdownMenu, DropdownItem } from 'vant'
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { nonCharacter, isName, isIdCard, isPhone } from '@/utils/validate'
import { phoneNumber } from '@/utils/formatter'
import { isEmpty } from 'lodash-es'
import router, { currentRoute } from '@/router'
import * as imageConversion from 'image-conversion'

import { submitEnterpriseInfo, findEnterpriseInfo } from '@/api/customer'
import { uploadFile, queryLicenseNum } from '@/api/common'

import inactiveIcon from '@/assets/icon/select-icon.png'
import cameraIcon from '@/assets/icon/camera-icon.png'
import cardFront from '@/assets/img/card-front.png'
import cardBack from '@/assets/img/card-back.png'

const instance = getCurrentInstance()
const currentRoutes = currentRoute()
const { $store } = instance.proxy
// 行业类型：1  建筑业 2  制造业 3  交通运输、仓储业和邮政业 4  信息传输、计算机服务和软件业 5  批发和零售业 6  住宿、餐饮业 7  金融、保险业 8  房地产业 9  租赁和商务服务业 10  教育、培训 11  文化、体育、娱乐业 12  其它
const columns = ref([
    { text: '建筑业', value: '1' },
    { text: '制造业', value: '2' },
    { text: '交通运输、仓储业和邮政业', value: '3' },
    { text: '信息传输、计算机服务和软件业', value: '4' },
    { text: '批发和零售业', value: '5' },
    { text: '住宿、餐饮业', value: '6' },
    { text: '金融、保险业', value: '7' },
    { text: '房地产业', value: '8' },
    { text: '租赁和商务服务业', value: '9' },
    { text: '教育、培训', value: '10' },
    { text: '文化、体育、娱乐业', value: '11' },
    { text: '其它', value: '12' }
])
const corporateIdBack = ref([])
const corporateIdFront = ref([])
const businessLicense = ref([])
const formData = reactive({
    data: {
        name: '',
        licenseNum: '',
        businessAddress: '',
        industryType: '',
        businessLicense: '',
        corporateIdFront: '',
        corporateIdBack: '',
        corporateName: '',
        corporateId: '',
        corporatePhone: ''
    }
})
const licensePhone = ref('')
const isDisabled = ref(false)
const formRef = ref()
// 是否是从驳回列表页进来的
const editAudit = ref(false)
// 企业id
const enterpriseId = ref('')
const placeholderShow = ref(true)

const dropItemChange = () => {
    placeholderShow.value = false
}

const queryLicenseNumAccess = val => {
    return new Promise(resolve => {
        if (val.length < 12) {
            resolve(true)
            return false
        }
        try {
            queryLicenseNum({
                data: {
                    licenseNum: val,
                    enterpriseId: enterpriseId.value
                },
                hideloading: true
            }).then(res => {
                if (String(res.data.status) === '2') {
                    licensePhone.value = res.data.phone
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        } catch (err) {
            return false
        }
    })
}

const rules = reactive({
    name: [
        { required: true, message: '请填写企业名称' },
        { pattern: /^.{4,50}$/, message: '长度必须是4-50位' },
        { validator: nonCharacter, message: '请输入正确的企业名称' }
    ],
    licenseNum: [
        { required: true, message: '请填写营业执照号/社会信用代码' },
        { pattern: /^.{4,50}$/, message: '长度必须是4-50位' },
        { validator: nonCharacter, message: '请输入正确的营业执照号/社会信用代码' },
        {
            validator: queryLicenseNumAccess,
            message: () => {
                return `该企业正在申请中，请使用末尾为${licensePhone.value.slice(-4)}的账户继续进行`
            }
        }
    ],
    businessAddress: [
        { required: true, message: '请填写实际经营地址' },
        { pattern: /^.{1,100}$/, message: '长度必须是1-100位' },
        { validator: nonCharacter, message: '请输入正确的实际经营地址' }
    ],
    industryType: [{ required: true, message: '请选择行业类型' }],
    businessLicense: [{ required: true, message: '请上传营业执照' }],
    corporateIdFront: [
        {
            validator: () => {
                if (!formData.data.corporateIdFront || !formData.data.corporateIdFront.length) {
                    return false
                }
                return true
            },
            message: '请上传身份证人像面'
        }
    ],
    corporateIdBack: [
        {
            validator: () => {
                if (!formData.data.corporateIdBack || !formData.data.corporateIdBack.length) {
                    return false
                }
                return true
            },
            message: '请上传身份证国徽面'
        }
    ],
    corporateName: [
        { required: true, message: '请填写法人姓名' },
        { validator: isName, message: '请输入正确的法人姓名' }
    ],
    corporateId: [
        { required: true, message: '请填写法人身份证号' },
        { validator: isIdCard, message: '请输入正确的法人身份证号' }
    ],
    corporatePhone: [
        { required: true, message: '请填写法人联系方式' },
        { validator: isPhone, message: '请输入正确的法人联系方式' }
    ]
})

const onClickLeft = () => {
    router.push({ name: 'List' })
}

const afterRead = (file, details) => {
    file.status = 'uploading'
    file.message = '上传中...'
    try {
        const { lastModified, lastModifiedDate, name, type, webkitRelativePath } = file.file
        imageConversion.compress(file.file, 0.4).then(async resData => {
            const newFile = new File([resData], name, {
                lastModified,
                lastModifiedDate,
                type,
                size: resData.size,
                webkitRelativePath
            })
            const res = await uploadFile({
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    file: newFile
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                file.status = 'done'
                file.message = '上传完成'
                formData.data[details.name] = res.data[0]
            }
        })
    } catch (err) {
        file.status = 'failed'
        file.message = '上传失败'
    }
}

const deleteRead = (file, details) => {
    if (['businessLicense', 'corporateIdFront', 'corporateIdBack'].indexOf(details.name) !== -1) {
        formData.data[details.name] = []
    } else {
        formData.data[details.name] = ''
    }
}

const onSubmit = async () => {
    formRef.value
        .validate()
        .then(async () => {
            try {
                const res = await submitEnterpriseInfo({
                    data: formData.data
                })
                if (!isEmpty(res)) {
                    if (!enterpriseId.value) {
                        $store.commit('app/SET_ENTERPRISE_ID', res.data.id)
                    }
                    router.push({ name: !editAudit.value ? 'Operator' : 'List' })
                }
            } catch (err) {
                return false
            }
        })
        .catch(() => {})
}

onMounted(async () => {
    if (currentRoutes.params.isClear) {
        $store.commit('app/SET_ENTERPRISE_ID', '')
    }
    enterpriseId.value = $store.getters['app/enterpriseId']
    editAudit.value = $store.getters['app/editAudit']
    if (enterpriseId.value) {
        try {
            const res = await findEnterpriseInfo({
                data: {
                    id: enterpriseId.value
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                if (res.data.businessLicense) {
                    formData.data = res.data
                    if (formData.data.industryType) {
                        placeholderShow.value = false
                        formData.data.industryType = `${formData.data.industryType}`
                    }
                    businessLicense.value = res.data.businessLicense
                        ? [{ url: `https://${res.data.businessLicense}` }]
                        : []
                    corporateIdFront.value = res.data.corporateIdFront
                        ? [{ url: `https://${res.data.corporateIdFront}` }]
                        : []
                    corporateIdBack.value = res.data.corporateIdBack
                        ? [{ url: `https://${res.data.corporateIdBack}` }]
                        : []
                }
            }
        } catch (err) {
            return false
        }
    }
})
</script>
