import api from './index'
// axios
import request from '@/utils/request'

// 签署协议
export const signContract = d => {
    return request({
        url: api.Sign.signContract,
        method: 'post',
        ...d
    })
}
