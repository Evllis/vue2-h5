<template>
    <div class="operator-page">
        <NavBar
            title="客户补充信息"
            :left-arrow="!editAudit"
            @click-left="backRouter"
            :style="{ paddingLeft: `${editAudit ? '15px' : ''}` }"
        />
        <div class="body-container operator-page__body">
            <Form
                @submit="onSubmit"
                ref="formRef"
                :validate-first="true"
                :validate-trigger="'onSubmit'"
                class="pt-25px"
            >
                <div class="form-wrap">
                    <Field class="custom-wrap" :rules="rules.doorHeadPhoto" name="doorHeadPhoto">
                        <template #label>
                            <div class="flex items-center justify-between">
                                <span>门头照片</span>
                                <span class="font-bold text-[var(--primary-active-color)]" @click="previewExample"
                                    >查看示例</span
                                >
                            </div>
                        </template>
                        <template #input>
                            <div class="flex-1 h-full custom-upload">
                                <Uploader
                                    v-model="doorHeadPhoto"
                                    name="doorHeadPhoto"
                                    :disabled="isPreview"
                                    :after-read="afterRead"
                                    :before-delete="beforeDelete"
                                    @delete="deleteRead"
                                >
                                    <div
                                        v-show="!formData.data.doorHeadPhoto.length"
                                        class="flex items-center justify-center h-full"
                                    >
                                        <div class="flex flex-col items-center">
                                            <Icon :name="cameraIcon" />
                                            <span class="normal-text">点击上传客户与门头合照</span>
                                        </div>
                                    </div>
                                </Uploader>
                            </div>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.socialSecurityType"
                        :right-icon="inactiveIcon"
                        name="industryType"
                        label="社保缴纳方式"
                        class="select-cell"
                    >
                        <template #input>
                            <div id="drop-container" class="drop-container">
                                <DropdownMenu>
                                    <DropdownItem
                                        v-model="formData.data.socialSecurityType"
                                        :disabled="isPreview"
                                        :options="columns"
                                        get-container="#drop-container"
                                    ></DropdownItem>
                                </DropdownMenu>
                            </div>
                        </template>
                    </Field>
                    <Field
                        v-model="formData.data.socialSecurityNumber"
                        name="socialSecurityNumber"
                        label="社保缴纳人数"
                        placeholder="请输入社保缴纳人数"
                        class="!mb-0"
                        :disabled="isPreview"
                        :formatter="formatterGtZeroInteger"
                        :rules="[{ required: true, message: '请填写社保缴纳人数' }]"
                    />
                    <Field class="social-wrap mb-16px" :rules="rules.socialSecurityUrls" name="socialSecurityUrls">
                        <template #input>
                            <div class="upload-container w-full h-full">
                                <h3 class="flex items-center justify-between">
                                    最近连续6个月内社保缴纳截图（1-6张）
                                    <span class="underline" @click="socialShow = true">查看示例</span>
                                </h3>
                                <Uploader
                                    v-model="urls.socialSecurityUrls"
                                    :after-read="afterRead"
                                    :before-delete="beforeDelete"
                                    :disabled="isPreview"
                                    :max-count="6"
                                    :upload-icon="addIcon"
                                    @delete="deleteRead"
                                    multiple
                                    name="socialSecurityUrls"
                                />
                            </div>
                        </template>
                    </Field>
                    <Field class="social-wrap" name="taxCertificateUrls">
                        <template #input>
                            <div class="upload-container w-full h-full">
                                <h3 class="flex items-center justify-between">
                                    纳税截图（非必填，1-6张）
                                    <span class="underline" @click="payShow = true">查看示例</span>
                                </h3>
                                <Uploader
                                    v-model="urls.taxCertificateUrls"
                                    :after-read="afterRead"
                                    :before-delete="beforeDelete"
                                    :disabled="isPreview"
                                    :max-count="6"
                                    :upload-icon="addIcon"
                                    @delete="deleteRead"
                                    multiple
                                    name="taxCertificateUrls"
                                />
                            </div>
                        </template>
                    </Field>
                    <Field
                        v-model="unicomProvinceText"
                        :right-icon="inactiveIcon"
                        label="业务归属省/市"
                        readonly
                        clickable
                        name="unicomProvince"
                        placeholder="请选择业务归属省/市"
                        class="select-wrap"
                        :disabled="isPreview"
                        :rules="rules.unicomProvince"
                        @click="previewRegion"
                    />
                </div>
                <div class="flex submit-footer">
                    <VanButton
                        v-if="!editAudit"
                        block
                        type="info"
                        native-type="button"
                        class="submit-button mr-10px"
                        @click="backRouter"
                        >上一步</VanButton
                    >
                    <VanButton v-if="!isPreview" block type="info" native-type="submit" class="submit-button">{{
                        editAudit ? '提交' : '下一步'
                    }}</VanButton>
                </div>
            </Form>
            <Popup
                v-model="socialShow"
                position="right"
                :style="{ width: '100%', height: '100%' }"
                get-container="#app"
            >
                <NavBar title="查看示例" left-arrow @click-left="socialShow = false" />
                <div class="example-body">
                    <p class="mark">社保截图要求：</p>
                    <ul class="mb-24px">
                        <li>*社保截图必须为真实电子原件，且内容清晰可辨、无遮挡</li>
                        <li>
                            *社保截图内容至少需包含<span class="font-bold underline"
                                >单位信息、参保人员明细、查询日期、近半年缴存情况</span
                            >等4大要素
                        </li>
                    </ul>
                    <p class="mb-24px">备注：可在官方社保平台进行查询截图 (网址后缀为gov.cn)</p>
                    <p class="mb-10px">示例图：</p>
                    <VanImage :src="socialImage" lass="mb-10px" />
                    <P>网址：【 江苏：http://rs.jshrss.jiangsu.gov.cn 】</P>
                </div>
            </Popup>
            <Popup v-model="payShow" position="right" :style="{ width: '100%', height: '100%' }" get-container="#app">
                <NavBar title="查看示例" left-arrow @click-left="payShow = false" />
                <div class="example-body">
                    <p class="mark">纳税截图要求：</p>
                    <ul class="mb-24px">
                        <li>*纳税截图必须为真实电子原件，且内容清晰可辨、无遮挡</li>
                        <li>
                            *纳税截图内容必须包含<span class="font-bold underline"
                                >二维码、纳税人信息、纳税总额、税务章</span
                            >等要素
                        </li>
                    </ul>
                    <p class="mb-10px">示例图：</p>
                    <VanImage :src="payImage" />
                </div>
            </Popup>
            <Popup v-model="showPicker" position="bottom" get-container="#app" @open="popupOpen">
                <Picker
                    show-toolbar
                    ref="areaRef"
                    :columns="areaList"
                    @confirm="onConfirm"
                    @cancel="showPicker = false"
                />
            </Popup>
        </div>
    </div>
</template>

<script setup>
import {
    NavBar,
    Form,
    Field,
    Uploader,
    Icon,
    DropdownMenu,
    DropdownItem,
    ImagePreview,
    Popup,
    Picker,
    Image as VanImage
} from 'vant'
import { reactive, ref, getCurrentInstance, onMounted, nextTick } from 'vue'
import { isEmpty, isArray } from 'lodash-es'
import router from '@/router'
import { formatterGtZeroInteger } from '@/utils'
import * as imageConversion from 'image-conversion'

import { uploadFile, regionInfo } from '@/api/common'
import { submitEnterpriseSocialSecurityV2, findEnterpriseSocialSecurityV2 } from '@/api/customer'

import cameraIcon from '@/assets/icon/camera-icon.png'
import addIcon from '@/assets/icon/add-icon.png'
import example from '@/assets/img/example.png'
import inactiveIcon from '@/assets/icon/select-icon.png'
import socialImage from '@/assets/img/social-image.png'
import payImage from '@/assets/img/pay-image.png'

const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const socialShow = ref(false)
const payShow = ref(false)
const editAudit = ref(false)
const isPreview = ref(false)
const formRef = ref()
const doorHeadPhoto = ref([])
const urls = reactive({
    socialSecurityUrls: [],
    taxCertificateUrls: []
})
const unicomProvinceText = ref('')
const formData = reactive({
    data: {
        type: '', // 页面入口来源 1-正常流程进入 2-审核驳回页面进入
        doorHeadPhoto: [],
        socialSecurityType: '1',
        socialSecurityNumber: '',
        socialSecurityUrls: [],
        taxCertificateUrls: [],
        unicomProvince: '', // 归属联通省分公司
        unicomProvinceCode: '', // 归属联通省code
        unicomCity: '', // 归属联通市分公司
        unicomCityCode: '' // 归属联通市code
    }
})

const areaIndex = reactive({
    data: {
        province: 0,
        city: 0
    }
})
const selectAreaData = ref([])
const areaRef = ref()
const areaList = ref([])
const showPicker = ref(false)
const columns = ref([
    { text: '公司自缴', value: '1' },
    { text: '三方机构代办', value: '2' }
])
const rules = reactive({
    doorHeadPhoto: [
        {
            validator: () => {
                if (!formData.data.doorHeadPhoto || !formData.data.doorHeadPhoto.length) {
                    return false
                }
                return true
            },
            message: '请上传法人授权书'
        }
    ],
    socialSecurityUrls: [
        {
            validator: () => {
                if (!formData.data.socialSecurityUrls || formData.data.socialSecurityUrls.length < 1) {
                    return false
                }
                return true
            },
            message: '社保缴纳截图至少上传1张'
        }
    ],
    unicomProvince: [{ required: true, message: '请选择业务归属省/市' }]
})

const backRouter = () => {
    router.push({ name: 'Enterprise' })
}

const previewExample = () => {
    ImagePreview([example])
}

const popupOpen = async () => {
    await nextTick()
    areaRef.value.setColumnIndex(0, areaIndex.data.province)
    areaRef.value.setColumnIndex(1, areaIndex.data.city)
}

const onConfirm = (columns, indexs) => {
    areaIndex.data.province = indexs[0]
    areaIndex.data.city = indexs[1]
    const province = areaList.value[indexs[0]]
    const city = province.children[indexs[1]]
    selectAreaData.value = [
        { name: province.text, code: province.code },
        { name: city.text, code: city.code }
    ]
    unicomProvinceText.value = `${selectAreaData.value[0].name} / ${selectAreaData.value[1].name}`
    showPicker.value = false
}

const imageCompress = async file => {
    const { lastModified, lastModifiedDate, name, type, webkitRelativePath } = file
    const res = await imageConversion.compress(file, 0.4)
    const newFile = new File([res], name, {
        lastModified,
        lastModifiedDate,
        type,
        size: res.size,
        webkitRelativePath
    })
    return new Promise(reject => {
        reject(newFile)
    })
}

const updateUploadItem = (arr, status = 'uploading', text = '上传中...') => {
    if (isArray(arr)) {
        arr.forEach(item => {
            item.status = status
            item.message = text
        })
    } else {
        arr.status = status
        arr.message = text
    }
}

const afterRead = async (file, details) => {
    updateUploadItem(file)
    const data = new FormData()
    if (isArray(file)) {
        const arr = file.map(item => item.file)
        for (const item of arr) {
            const fileData = await imageCompress(item)
            data.append('file', fileData)
        }
    } else {
        const fileData = await imageCompress(file.file)
        data.append('file', fileData)
    }
    const res = await uploadFile({
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data,
        hideloading: true
    })
    if (!isEmpty(res.data)) {
        if (+res.returnCode !== 1000) {
            updateUploadItem(file, 'failed', '上传失败')
            return false
        }
        updateUploadItem(file, 'done', '上传完成')
        if (['socialSecurityUrls', 'taxCertificateUrls'].indexOf(details.name) === -1) {
            formData.data[details.name] = res.data[0]
        } else {
            res.data.forEach(item => {
                for (const val of urls[details.name]) {
                    if (!val.imgUrl) {
                        val['imgUrl'] = item
                        break
                    }
                }
            })
            formData.data[details.name] = urls[details.name].map(item => item.imgUrl)
        }
    } else {
        updateUploadItem(file, 'failed', '上传失败')
    }
}

const beforeDelete = () => {
    if (isPreview.value) return false
    return true
}

const previewRegion = () => {
    if (beforeDelete()) {
        showPicker.value = true
    }
}

const deleteRead = (file, details) => {
    formData.data[details.name] =
        ['socialSecurityUrls', 'taxCertificateUrls'].indexOf(details.name) === -1
            ? ''
            : urls[details.name].map(item => item.imgUrl)
}

const onSubmit = async () => {
    const enterpriseId = $store.getters['app/enterpriseId']
    if (enterpriseId) {
        formData.data['enterpriseId'] = enterpriseId
        formData.data['type'] = !editAudit.value ? '1' : '2'
        formRef.value
            .validate()
            .then(async () => {
                try {
                    const data = Object.assign(formData.data, {
                        enterpriseId,
                        unicomProvince: selectAreaData.value[0].name,
                        unicomProvinceCode: selectAreaData.value[0].code,
                        unicomCity: selectAreaData.value[1].name,
                        unicomCityCode: selectAreaData.value[1].code,
                        type: editAudit.value ? '2' : '1'
                    })
                    await submitEnterpriseSocialSecurityV2({ data })
                    $store.commit('app/SET_EDIT_AUDIT', '')
                    router.push({ name: editAudit.value ? 'List' : 'Audit' })
                } catch (err) {
                    return false
                }
            })
            .catch(() => {})
    } else {
        $toast.fail({
            message: '请重新登录',
            onClose: () => {
                router.push({ name: 'Login' })
            }
        })
    }
}

const getRegion = async () => {
    const regions = await regionInfo({
        hideloading: true
    })
    if (regions && !isEmpty(regions.data)) {
        const areaData = []
        regions.data.forEach(item => {
            const childrenCity = []
            item.child.forEach(elem => {
                childrenCity.push({ text: elem.name, code: elem.code })
            })
            areaData.push({
                text: item.name,
                code: item.code,
                children: childrenCity
            })
        })
        areaList.value = areaData.map(item => item)
    }
}

onMounted(async () => {
    const enterpriseId = $store.getters['app/enterpriseId']
    editAudit.value = $store.getters['app/editAudit']
    isPreview.value = $store.getters['app/isPreview']
    if (enterpriseId) {
        try {
            await getRegion()
            const res = await findEnterpriseSocialSecurityV2({
                data: {
                    enterpriseId
                },
                hideloading: true
            })
            if (!isEmpty(res.data)) {
                if (res.data.doorHeadPhoto) {
                    formData.data = res.data
                    formData.data.socialSecurityType = `${formData.data.socialSecurityType}`
                    doorHeadPhoto.value = res.data.doorHeadPhoto ? [{ url: `https://${res.data.doorHeadPhoto}` }] : []
                    urls.socialSecurityUrls = res.data.socialSecurityUrls
                        ? res.data.socialSecurityUrls.map(item => {
                              return {
                                  url: `https://${item}`
                              }
                          })
                        : []
                    urls.taxCertificateUrls = res.data.taxCertificateUrls
                        ? res.data.taxCertificateUrls.map(item => {
                              return {
                                  url: `https://${item}`
                              }
                          })
                        : []
                    unicomProvinceText.value = `${formData.data.unicomProvince} / ${formData.data.unicomCity}`
                    const provinceIndex = areaList.value.findIndex(
                        item => item.code === formData.data.unicomProvinceCode
                    )
                    const cityIndex = areaList.value[provinceIndex].children.findIndex(
                        item => item.code === formData.data.unicomCityCode
                    )
                    areaIndex.data = {
                        province: provinceIndex,
                        city: cityIndex
                    }
                    selectAreaData.value = [
                        { name: formData.data.unicomProvince, code: formData.data.unicomProvinceCode },
                        { name: formData.data.unicomCity, code: formData.data.unicomCityCode }
                    ]
                }
            }
        } catch (err) {
            return false
        }
    }
})
</script>

<style lang="scss" scoped>
.operator-page {
    :deep(.upload-container) {
        & > .van-uploader {
            width: auto;
            height: auto;
            background-color: transparent;
        }
    }
    :deep(.social-wrap .van-field__body) {
        padding-bottom: 0;
        &::after {
            display: none;
        }
    }
}
.example-body {
    padding: 64px 14px 14px 14px;
    font-size: 13px;
    line-height: 23px;
    .mark {
        color: #ff5f01;
    }
}
</style>
