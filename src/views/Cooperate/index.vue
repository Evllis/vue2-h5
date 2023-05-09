<template>
    <div class="cooperate-page">
        <NavBar
            title="客户经理信息绑定"
            @click-left="onClickLeft"
            :left-arrow="!editAudit"
            :style="{ paddingLeft: `${editAudit ? '15px' : ''}` }"
        />
        <div class="body-container cooperate-page__body">
            <Form @submit="onSubmit" ref="formRef" :validate-first="true" :validate-trigger="'onSubmit'">
                <div class="form-wrap pt-25px">
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
                    />
                    <Field
                        v-model="formData.data.unicomManagerName"
                        name="unicomManagerName"
                        label="客户经理姓名"
                        placeholder="请输入客户经理姓名"
                        :rules="rules.unicomManagerName"
                    />
                    <Field
                        v-model="formData.data.unicomManagerPhone"
                        name="unicomManagerPhone"
                        label="客户经理联系方式"
                        placeholder="请输入客户经理联系方式"
                        :rules="rules.unicomManagerPhone"
                    />
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="submit" class="submit-button">提交</VanButton>
                </div>
            </Form>
        </div>
        <Popup v-model="showPicker" position="bottom" get-container="#app" @open="popupOpen">
            <!-- <Area
                :area-list="areaList.data"
                :columns-num="2"
                :value="areaValue"
                @confirm="onConfirm"
                @cancel="showPicker = false"
            /> -->
            <Picker show-toolbar ref="areaRef" :columns="areaList" @confirm="onConfirm" @cancel="showPicker = false" />
        </Popup>
    </div>
</template>

<script setup>
import { NavBar, Form, Field, Popup, Picker } from 'vant'
import { reactive, ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import router from '@/router'
import { useCache } from '@/hooks/useCache'

import { regionInfo } from '@/api/common'
import { submitEnterpriseUnicomInfo, findEnterpriseUnicomInfo } from '@/api/cooperate'

import { isLetterNumber, isName, isPhone } from '@/utils/validate'

import inactiveIcon from '@/assets/icon/select-icon.png'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const areaIndex = reactive({
    data: {
        province: 0,
        city: 0
    }
})
const areaRef = ref()
const formRef = ref()
const selectAreaData = ref([])
const showPicker = ref(false)

const areaList = ref([])
const rules = reactive({
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
        unicomProvince: '',
        unicomManagerNumber: '',
        unicomManagerName: '',
        unicomManagerPhone: ''
    }
})
const editAudit = ref(false)

const onClickLeft = () => {
    router.push({ name: 'Operator' })
}

const onConfirm = (columns, indexs) => {
    const province = areaList.value[indexs[0]]
    const city = province.children[indexs[1]]
    selectAreaData.value = [
        { name: province.text, code: province.code },
        { name: city.text, code: city.code }
    ]
    formData.data.unicomProvince = `${selectAreaData.value[0].name} / ${selectAreaData.value[1].name}`
    showPicker.value = false
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
        formRef.value
            .validate()
            .then(async () => {
                try {
                    await submitEnterpriseUnicomInfo({
                        data
                    })
                    router.push({ name: !editAudit.value ? 'Network' : 'Audit' })
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

const popupOpen = async () => {
    await nextTick()
    areaRef.value.setColumnIndex(0, areaIndex.data.province)
    areaRef.value.setColumnIndex(1, areaIndex.data.city)
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
                if (res.data.unicomManagerPhone) {
                    const current = areaList.value.filter(item => item.code === res.data.unicomProvinceCode)
                    formData.data = res.data
                    formData.data.unicomProvince = `${res.data.unicomProvince} / ${res.data.unicomCity}`
                    // areaIndex
                    areaIndex.data.province = areaList.value.findIndex(
                        item => item.code === res.data.unicomProvinceCode
                    )
                    areaIndex.data.city = current[0].children.findIndex(item => item.code === res.data.unicomCityCode)
                    const item = areaList.value[areaIndex.data.province]
                    const itemChildren = item.children[areaIndex.data.city]
                    selectAreaData.value = [
                        {
                            name: item.text,
                            code: item.code
                        },
                        { name: itemChildren.text, code: itemChildren.code }
                    ]
                }
            }
        } catch (err) {
            return false
        }
    }
}

onMounted(async () => {
    editAudit.value = $store.getters.editAudit
    try {
        const res = await regionInfo({
            hideloading: true
        })
        if (res && !isEmpty(res.data)) {
            const areaData = []
            res.data.forEach(item => {
                // areaList.data.province_list[item.code] = item.name
                const childrenCity = []
                item.child.forEach(elem => {
                    childrenCity.push({ text: elem.name, code: elem.code })
                    // childrenCity[`${item.code}${elem.code}`] = elem.name
                })
                // areaList.data.city_list = Object.assign(areaList.data.city_list, childrenCity)
                areaData.push({
                    text: item.name,
                    code: item.code,
                    children: childrenCity
                })
            })
            areaList.value = areaData.map(item => item)
        }
        backFillData()
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
