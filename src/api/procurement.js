import api from './index'
// axios
import request from '@/utils/request'

// 采购清单新增/编辑
export const editBuy = d => {
    return request({
        url: api.Procurement.editBuy,
        method: 'post',
        ...d
    })
}

// 采购清单列表
export const findBuyList = d => {
    return request({
        url: api.Procurement.findBuyList,
        method: 'post',
        ...d
    })
}
