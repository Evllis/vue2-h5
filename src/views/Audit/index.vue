<template>
    <div class="audit-page">
        <NavBar title="审核中" />
        <div class="body-container audit-page__body">
            <div
                v-if="+auditStatus === 2 || +auditStatus === 5"
                class="flex flex-col items-center justify-center audit-wrap"
                :style="{ backgroundColor: '#f8f8f8' }"
            >
                <VanImage :src="filterAuditImg" />
                <!-- <p>{{ auditMsg }}</p> -->
                <div v-if="+auditStatus === 2" class="flex flex-col items-center justify-center">
                    <p>您的授信审核已提交，预计T+1审核完成</p>
                    <VanButton block type="info" native-type="button" class="submit-button">确定</VanButton>
                </div>
                <div v-if="+auditStatus === 5" class="flex flex-col items-center justify-center">
                    <p>您司不符合准入标准，2023年9月29日 可再次提交审核</p>
                    <VanButton block type="info" native-type="button" class="submit-button">完成</VanButton>
                </div>
            </div>
            <div v-if="+auditStatus === 3">
                <Preview :isSubmit="true" />
            </div>
            <div
                v-if="+auditStatus === 4"
                class="form-wrap !p-0"
                :style="{ backgroundColor: '#F8F8F8', paddingTop: '20px' }"
            >
                <div class="mt-0 !p-15px scroll-wrap">
                    <ul class="package-list">
                        <li v-for="item in auditList" :key="item.step" class="package-item">
                            <div class="flex items-center package-body">
                                <div class="flex-1 flex flex-col package-wrap">
                                    <div class="flex package-info text-[var(--secondary-color)]">
                                        <span>{{ item.step }}</span>
                                    </div>
                                    <div>
                                        <span>{{ item.msg }}</span>
                                    </div>
                                </div>
                                <div class="package-opts">
                                    <VanButton
                                        plain
                                        type="primary"
                                        native-type="button"
                                        color="var(--primary-active-color)"
                                        @click="modifyAudit(item)"
                                        >修改</VanButton
                                    >
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="flex submit-footer">
                    <VanButton block type="info" native-type="button" class="submit-button !m-0" to="/preview/home"
                        >全部提交</VanButton
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance } from 'vue'
import { NavBar, Image as VanImage } from 'vant'
import { useCache } from '@/hooks/useCache'
// import { stepMap } from '@/store/config'
import router from '@/router'

import Preview from '@/components/Preview'

import { queryAudit } from '@/api/audit'

import auditIng from '@/assets/img/audit-ing.png'
import auditFail from '@/assets/img/audit-fail.png'
import { isEmpty } from 'lodash-es'

const { wsCache } = useCache()
const instance = getCurrentInstance()
const { $toast } = instance.proxy

const auditStatus = ref(2)
const enterpriseId = ref('')
const auditList = ref([])
// const auditMsg = ref('')

const filterAuditImg = computed(() => {
    if (+auditStatus.value === 2) {
        return auditIng
    }
    return auditFail
})

const queryAuditAccess = async () => {
    try {
        const res = await queryAudit({
            data: {
                enterpriseId: enterpriseId.value
            },
            hideloading: true
        })
        if (!isEmpty(res)) {
            // res.data.auditStatus: 审核状态：1-未提交 2-审核中 3-审核通过 4-审核驳回 5-审核拒绝
            auditList.value = res.data.auditList.map(item => item)
        }
    } catch (err) {
        return false
    }
}

onMounted(async () => {
    // auditStatus.value = router?.history?.current?.query?.type
    enterpriseId.value = wsCache.get('enterpriseId')
    if (enterpriseId.value) {
        try {
            const res = await queryAudit({
                data: {
                    enterpriseId: enterpriseId.value
                },
                hideloading: true
            })
            if (!isEmpty(res)) {
                // res.data.auditStatus: 审核状态：1-未提交 2-审核中 3-审核通过 4-审核驳回 5-审核拒绝
                auditStatus.value = res.data.auditStatus
                // if (+res.data.auditStatus === 2) {
                //     auditMsg.value = '您的授信审核已提交，预计T+1审核完成'
                // } else if (+res.data.auditStatus === 3) {
                //     auditMsg.value = '审核通过'
                // } else if (+res.data.auditStatus === 4) {
                //     auditMsg.value = '审核驳回'
                //     // setTimeout(() => router.push({ name: stepMap[res.data.auditList.step] }), 1500)
                // } else if (+res.data.auditStatus === 5) {
                //     auditMsg.value = '您司不符合准入标准，xxxx年xx月xx日可再次提交审核'
                // }
                if (+auditStatus.value === 4) {
                    queryAuditAccess()
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
    :deep(.van-nav-bar__content) {
        padding-left: 30px;
    }
    &__body {
        .audit-wrap {
            padding-top: 95px;
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
