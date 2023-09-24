import api from './index'
// axios
import request from '@/utils/request'

// 企业基本信息提交
export const submitEnterpriseInfo = d => {
    return request({
        url: api.Customer.submitEnterpriseInfo,
        method: 'post',
        ...d
    })
}

// 企业基本信息回显
export const findEnterpriseInfo = d => {
    return request({
        url: api.Customer.findEnterpriseInfo,
        method: 'post',
        ...d
    })
}

// 补充客户经理信息
export const editCustomerInfo = d => {
    return request({
        url: api.Customer.editCustomerInfo,
        method: 'post',
        ...d
    })
}

// 客户补充信息回显
export const findEnterpriseSocialSecurityV2 = d => {
    return request({
        url: api.Customer.findEnterpriseSocialSecurityV2,
        method: 'post',
        ...d
    })
}

// 客户补充信息提交
export const submitEnterpriseSocialSecurityV2 = d => {
    return request({
        url: api.Customer.submitEnterpriseSocialSecurityV2,
        method: 'post',
        ...d
    })
}
