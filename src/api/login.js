import api from './index'
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

// // 登录
// export function login(data) {
//     return request({
//         url: api.Login,
//         method: 'post',
//         data
//     })
// }

// // 用户信息 post 方法
// export function getUserInfo(data) {
//     return request({
//         url: api.UserInfo,
//         method: 'post',
//         data,
//         hideloading: true
//     })
// }

// // 用户名称 get 方法
// export function getUserName(params) {
//     return request({
//         url: api.UserName,
//         method: 'get',
//         params,
//         hideloading: true
//     })
// }
