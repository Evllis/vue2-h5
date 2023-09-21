import { ref } from 'vue'

export const stepMap = ref({
    // 0: 'Customer', // 身份选择
    0: 'Customer', // 补充信息
    1: 'Enterprise', // 企业基本信息
    2: 'Person', // 企业经办人信息
    3: 'Operator', // 门头社保信息
    4: 'Cooperate', // 与联通合作信息
    5: 'Network', // 入网清单
    6: 'Procurement', // 采购清单
    7: 'Receipt', // 合同预填写
    8: 'Preview', // 协议预览
    9: 'Audit', // 审核结果页
    20: 'List' // 客户列表
    // 10: 'Sign'
})
