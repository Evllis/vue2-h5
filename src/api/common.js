import api from './index'
// axios
import request from '@/utils/request'

// 设置用户身份
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
