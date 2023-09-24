import api from './index'
// axios
import request from '@/utils/request'

// 文件上传
export const uploadFile = d => {
    return request({
        url: api.Common.uploadFile,
        method: 'post',
        ...d
    })
}

// 获取省市数据
export const regionInfo = (d = {}) => {
    return request({
        url: api.Common.regionInfo,
        method: 'post',
        ...d
    })
}

// 更新用户填写步骤
export const updateStep = (d = {}) => {
    return request({
        url: api.Common.updateStep,
        method: 'post',
        ...d
    })
}

// 校验营业执照号
export const queryLicenseNum = (d = {}) => {
    return request({
        url: api.Common.queryLicenseNum,
        method: 'post',
        ...d
    })
}

// 微信js-sdk签名
export const shareContract = (d = {}) => {
    return request({
        url: api.Common.shareContract,
        method: 'post',
        ...d
    })
}
