import { ref } from 'vue'

export const stepMap = ref({
    1: 'Customer', // 补充信息
    2: 'List' // 客户列表
})

// 审核驳回的步骤：1-企业基本信息 2-企业经办人信息 3-门头社保信息 4-与联通合作信息 5-入网清单 6-采购清单 7-合同预填写 8-协议预览
export const auditMap = ref({
    1: 'Enterprise', // 客户基本信息(企业基本信息)
    3: 'Operator', // 客户补充信息(门头社保信息)
    // 6: 'Sign', // 签署协议
    8: 'Preview' // 协议预览
    // 9: 'Audit', // 审核结果页
    // 20: 'List' // 客户列表
    // 10: 'Sign'
})
