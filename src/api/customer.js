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

// 经办人信息提交
export const submitEnterpriseOperator = d => {
    return request({
        url: api.Customer.submitEnterpriseOperator,
        method: 'post',
        ...d
    })
}

// 门头社保信息提交
export const submitEnterpriseSocialSecurity = d => {
    return request({
        url: api.Customer.submitEnterpriseSocialSecurity,
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

// 经办人信息回显
export const findEnterpriseOperator = d => {
    return request({
        url: api.Customer.findEnterpriseOperator,
        method: 'post',
        ...d
    })
}

// 门头社保信息回显
export const findEnterpriseSocialSecurity = d => {
    return request({
        url: api.Customer.findEnterpriseSocialSecurity,
        method: 'post',
        ...d
    })
}
