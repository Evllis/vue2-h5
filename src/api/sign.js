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

// 实名认证信息回显
export const getRealName = d => {
    return request({
        url: api.Sign.getRealName,
        method: 'post',
        ...d
    })
}

// 实名认证下发短信验证码
export const realNameAuth = d => {
    return request({
        url: api.Sign.realNameAuth,
        method: 'post',
        ...d
    })
}
