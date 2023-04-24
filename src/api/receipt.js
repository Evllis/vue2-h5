import api from './index'
// axios
import request from '@/utils/request'

// 合同预填写信息提交
export const submitEnterpriseContract = d => {
    return request({
        url: api.Receipt.submitEnterpriseContract,
        method: 'post',
        ...d
    })
}

// 合同预填写信息回显
export const findEnterpriseContract = d => {
    return request({
        url: api.Receipt.findEnterpriseContract,
        method: 'post',
        ...d
    })
}
