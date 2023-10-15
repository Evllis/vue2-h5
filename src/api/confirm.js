import api from './index'
// axios
import request from '@/utils/request'

// 签收确认单提交
export const submitConsigneeConfirm = d => {
    return request({
        url: api.Confirm.submitConsigneeConfirm,
        method: 'post',
        ...d
    })
}
