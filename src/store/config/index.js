import { ref } from 'vue'

export const stepMap = ref({
    0: 'Customer', // 补充信息
    1: 'Enterprise', // 客户基本信息
    3: 'Operator', // 客户补充信息
    6: 'Sign', // 签署协议
    8: 'Preview', // 协议预览
    9: 'Audit', // 审核结果页
    20: 'List' // 客户列表
    // 10: 'Sign'
})
