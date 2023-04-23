import api from './index'
// axios
import request from '@/utils/request'

// 联通合作信息提交
export const editSetmeal = d => {
    return request({
        url: api.Network.editSetmeal,
        method: 'post',
        ...d
    })
}

// 入网清单列表
export const findSetmealList = d => {
    return request({
        url: api.Network.findSetmealList,
        method: 'post',
        ...d
    })
}
