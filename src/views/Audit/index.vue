<template>
    <div class="audit-page">
        <NavBar :title="auditParams.title" :left-arrow="false" :style="{ paddingLeft: '15px' }" />
        <div class="body-container audit-page__body">
            <div v-if="+auditStatus !== 3" class="flex flex-1 flex-col items-center justify-center -mt-16 audit-wrap">
                <VanImage v-if="auditParams.img" :src="auditParams.img" />
                <div v-if="+auditStatus === 2" class="flex flex-col items-center justify-center w-7/10">
                    <p>您的业务申请已提交，预计T+1审核完成</p>
                </div>
                <div v-if="+auditStatus === 4" class="flex flex-col items-center justify-center w-7/10">
                    <p>您提交的业务申请不符合我司标准，敬请谅解!</p>
                    <p class="!mt-0">{{ auditExpireTime }}后可重新提交</p>
                </div>
                <div v-if="+auditStatus === 5" class="flex flex-col items-center justify-center w-7/10">
                    <p>您提交的业务申请已通过，我们将尽快联系您确定协议内容</p>
                </div>
                <div v-if="+auditStatus === 8" class="flex flex-col items-center justify-center w-7/10">
                    <p>协议内容有误，我们将尽快联系与您重新确定协议内容</p>
                </div>
            </div>
            <div v-else class="form-wrap !p-0" :style="{ paddingTop: '20px' }">
                <div class="audit-msg">抱歉，您的业务申请需要调整，请根据以下给出建议调整后重新提交：</div>
                <div class="mt-0 !p-15px scroll-wrap">
                    <ul class="package-list">
                        <li v-for="(item, index) in auditList" :key="item.step" class="package-item">
                            {{ index + 1 }}. {{ item.msg }}
                            <a href="javascript:void(0);" class="package-btn" @click="modifyAudit(item)">去处理></a>
                        </li>
                    </ul>
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button !m-0" @click="submitData"
                        >提交</VanButton
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, getCurrentInstance } from 'vue'
import { NavBar, Image as VanImage } from 'vant'
import { isEmpty } from 'lodash-es'
import { auditMap } from '@/store/config'
import router from '@/router'

import { queryAudit, auditStatusFourSubmit } from '@/api/audit'

import auditIng from '@/assets/img/audit-ing.png'
import auditSucc from '@/assets/img/audit-success.png'
import auditFail from '@/assets/img/audit-fail.png'

const instance = getCurrentInstance()
const { $toast, $store } = instance.proxy

const auditExpireTime = ref('')
const auditStatus = ref(0)
const enterpriseId = ref('')
const auditList = ref([])
const contractUrl = ref('')

const statusMap = reactive({
    data: {
        2: {
            img: auditIng,
            title: '审核中'
        },
        3: {
            img: '',
            title: '审核驳回'
        },
        4: {
            img: auditFail,
            title: '审核拒绝'
        },
        5: {
            img: auditSucc,
            title: '审核通过'
        },
        8: {
            img: auditSucc,
            title: '签署协议'
        }
    }
})

const auditParams = computed(() => {
    return (
        statusMap.data[auditStatus.value] || {
            img: '',
            title: ''
        }
    )
})

const modifyAudit = item => {
    $store.commit('app/SET_EDIT_AUDIT', true)
    router.push({ name: auditMap.value[item.step] })
}

const submitData = async () => {
    try {
        await auditStatusFourSubmit({
            data: {
                enterpriseId: enterpriseId.value
            }
        })
        $toast.fail({
            message: '提交成功',
            onClose: () => {
                auditStatus.value = 2
            }
        })
    } catch (err) {
        $toast.fail('提交失败，请重试')
        return false
    }
}

onMounted(async () => {
    enterpriseId.value = $store.getters['app/enterpriseId']
    const token = $store.getters['app/token'] || ''
    if (enterpriseId.value && token) {
        try {
            const res = await queryAudit({
                headers: {
                    Authorization: token
                },
                data: {
                    enterpriseId: enterpriseId.value
                },
                hideloading: true
            })
            if (!isEmpty(res)) {
                $store.commit('sign/SET_SIGN_SUCCESS', '')
                // 旧 - res.data.auditStatus: 审核状态：1-未提交 2-审核中 3-审核通过 4-审核驳回 5-审核拒绝
                // 新 - 审核状态：1-未提交 2-资质审核中 3-资质驳回 4-资质拒绝 5-协议待上传(审核通过,协议未确认状态) 6-协议待签署 7-协议已签署 8-协议驳回(复核协议未通过)
                auditStatus.value = res.data.auditStatus
                auditExpireTime.value = res.data.auditExpireTime || ''
                if (+auditStatus.value === 3) {
                    auditList.value = res.data.auditList.map(item => item)
                }
                if (+auditStatus.value === 6) {
                    $store.commit('sign/SET_LINK_URL', res.data.linkUrl)
                }
                if (+auditStatus.value === 7) {
                    $store.commit('sign/SET_SIGN_SUCCESS', '1')
                }
                if (+auditStatus.value === 6 || +auditStatus.value === 7) {
                    contractUrl.value = res.data.contractUrl
                    $store.commit('app/SET_ENTERPRISE_NAME', res.data.enterpriseName)
                    $store.commit('sign/BATCH_SETTINGS', {
                        contractCode: res.data.contractCode,
                        customerName: res.data.customerName,
                        pdfUrl: encodeURIComponent(contractUrl.value) || ''
                    })
                    router.push({
                        name: 'Sign'
                    })
                }
            }
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
})
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixin.scss';
.audit-page {
    &__body {
        :deep(.van-image__img) {
            width: 107px;
            height: auto;
        }
        p {
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
        .audit-msg {
            font-size: 14px;
            line-height: 19px;
            padding: 22px 15px 0 15px;
        }
        .package-item {
            padding: 0;
            line-height: 19px;
            word-break: break-all;
        }
        .package-btn {
            color: #ff5f01;
            text-decoration: underline;
            margin-left: 4px;
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
