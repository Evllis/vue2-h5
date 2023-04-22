<template>
    <div class="enterprise-page">
        <NavBar title="企业基本信息" left-arrow />
        <div class="body-container enterprise-page__body">
            <Form @submit="onSubmit" ref="formRef">
                <div class="form-wrap pt-25px">
                    <Field
                        v-model="formData.data.name"
                        :rules="rules.name"
                        name="name"
                        label="企业名称"
                        placeholder="请输入您的企业名称"
                        @change="changeValidate('name')"
                    />
                    <Field
                        v-model="formData.data.licenseNum"
                        :rules="rules.licenseNum"
                        @input="licenseNumInput"
                        @change="changeValidate('licenseNum')"
                        name="licenseNum"
                        label="营业执照/社会信用代码"
                        placeholder="请输入您营业执照/社会信用代码"
                    />
                    <div class="mb-25px">
                        <h3 class="custom-label">行业类型</h3>
                        <div id="drop-container" class="drop-container">
                            <div class="drop-placeholder" v-if="placeholderShow">请选择行业类型</div>
                            <DropdownMenu>
                                <DropdownItem
                                    v-model="formData.data.industryType"
                                    :options="columns"
                                    @change="dropItemChange"
                                    get-container="#drop-container"
                                ></DropdownItem>
                            </DropdownMenu>
                        </div>
                    </div>
                    <Field label="营业执照" class="custom-wrap businessLicense">
                        <template #input>
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
                        </template>
                    </Field>
                    <Field label="法人证件" class="custom-wrap card">
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
                            <Uploader
                                v-model="corporateIdBack"
                                name="corporateIdBack"
                                :after-read="afterRead"
                                @delete="deleteRead"
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
                    <Field
                        v-model="formData.data.corporateName"
                        :rules="rules.corporateName"
                        @change="changeValidate('corporateName')"
                        name="corporateName"
                        label="法人姓名"
                        placeholder="请输入法人姓名"
                    />
                    <Field
                        v-model="formData.data.corporateId"
                        :rules="rules.corporateId"
                        @change="changeValidate('corporateId')"
                        name="corporateId"
                        label="法人身份证号"
                        placeholder="请输入法人身份证号"
                    />
                    <Field
                        v-model="formData.data.corporatePhone"
                        :rules="rules.corporatePhone"
                        @change="changeValidate('corporatePhone')"
                        name="corporatePhone"
                        label="法人联系方式"
                        placeholder="请输入法人联系方式"
                    />
                </div>
                <div class="submit-footer">
                    <VanButton block :disabled="submitDisabled" type="info" native-type="submit" class="submit-button"
                        >下一步</VanButton
                    >
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Uploader, Icon, DropdownMenu, DropdownItem } from 'vant'
import { reactive, ref } from 'vue'
import { nonCharacter, isName, isIdCard, isPhone } from '@/utils/validate'
import { useRouter } from 'vue-router/composables'
import { isEmpty } from 'lodash-es'

import { submitEnterpriseInfo } from '@/api/customer'
import { uploadFile } from '@/api/common'

import cameraIcon from '@/assets/icon/camera-icon.png'
import cardFront from '@/assets/img/card-front.png'
import cardBack from '@/assets/img/card-back.png'

const router = useRouter()
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
        industryType: '',
        businessLicense: '',
        corporateIdFront: '',
        corporateIdBack: '',
        corporateName: '',
        corporatePhone: ''
    }
})
const submitDisabled = ref(true)
const placeholderShow = ref(true)
const formRef = ref()
const rules = reactive({
    name: [
        { required: true, message: '请填写企业名称' },
        { validator: nonCharacter, message: '请输入正确的企业名称' }
    ],
    licenseNum: [
        { required: true, message: '请填写营业执照号/社会信用代码' },
        { validator: nonCharacter, message: '请输入正确的营业执照号/社会信用代码', trigger: 'onChange' }
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

const updateSubmitButton = () => {
    let status = true
    for (const key in formData.data) {
        if (!formData.data[key].length) {
            status = false
            break
        }
    }
    submitDisabled.value = !status
}

const dropItemChange = () => {
    placeholderShow.value = false
    updateSubmitButton()
}

const changeValidate = type => {
    formRef.value
        .validate(type)
        .then(async () => {
            updateSubmitButton()
        })
        .catch(() => {})
}

const licenseNumInput = val => {
    formRef.value
        .validate('licenseNum')
        .then(async () => {
            console.log(5555, val)
        })
        .catch(() => {})
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
            }
        })
        if (!isEmpty(res.data)) {
            file.status = 'done'
            file.message = '上传完成'
            formData.data[details.name] = res.data
            updateSubmitButton()
        }
    } catch (err) {
        file.status = 'failed'
        file.message = '上传失败'
        updateSubmitButton()
    }
}

const deleteRead = (file, details) => {
    formData.data[details.name] = ''
    updateSubmitButton()
}

const onSubmit = async () => {
    // const data = {}
    // for (const key in formData.data) {
    //     const item = formData.data[key]
    //     data[key] = typeof item === 'string' ? item : item[0]
    // }
    try {
        await submitEnterpriseInfo({
            data: formData.data
        })
        // 这里需要判断身份, 跳转不同的页面
        // 经办人: Person, 企业门头: Operator
        setTimeout(() => router.push({ name: 'Person' }), 1000)
    } catch (err) {
        return false
    }
}
</script>
