import api from '@/api/index'
// axios
import request from '@/utils/request'

// 获取验证码
export const sendMsg = data => {
    return request({
        url: api.Login.sendMsg,
        method: 'post',
        data
    })
}

// 用户登录注册v2
export const loginRegisterV2 = data => {
    return request({
        url: api.Login.loginRegisterV2,
        method: 'post',
        data
    })
}
