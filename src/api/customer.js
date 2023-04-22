import api from './index'
// axios
import request from '@/utils/request'

// 设置用户身份
export const setRole = d => {
    return request({
        url: api.Customer.setRole,
        method: 'post',
        ...d
    })
}

// 企业基本信息提交
export const submitEnterpriseInfo = d => {
    return request({
        url: api.Customer.submitEnterpriseInfo,
        method: 'post',
        ...d
    })
}
