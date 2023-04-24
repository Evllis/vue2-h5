import api from './index'
// axios
import request from '@/utils/request'

// 协议预览
export const enterpriseContractPreview = d => {
    return request({
        url: api.Preview.enterpriseContractPreview,
        method: 'post',
        ...d
    })
}
