import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'
import $store from '@/store'

// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
import { useNProgress } from '@/hooks/useNProgress'

const { start, done } = useNProgress()

// create an axios instance
const service = axios.create({
    baseURL: baseApi, // url = base api url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

const getFail = async res => {
    if (res.returnCode && res.returnCode !== '1000') {
        // 登录失效, 清除token, 跳转到登录页面
        if (res.returnCode === '9997') {
            await $store.dispatch('resetSettings')
            Toast.fail({
                message: res.returnMsg,
                onClose: () => {
                    router.push({ name: 'Login' })
                }
            })
        } else {
            Toast({ message: res.returnMsg, duration: 2000 })
            throw new Error()
        }
    }
}

// request拦截器 request interceptor
service.interceptors.request.use(
    config => {
        start()
        // 不传递默认开启loading
        if (!config.hideloading) {
            // loading
            Toast.loading({
                message: '正在加载...',
                duration: 0,
                forbidClick: false
            })
        }
        const token = $store.getters['app/token']
        if (token) {
            config.headers['Authorization'] = token
        }
        // config.headers['Authorization'] =
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiMiIsInBob25lIjoiMTg3MzQyMjIyNjUiLCJpZCI6IjE2NTA3NDI5ODQ2NzEyNTY1NzYiLCJleHAiOjE2ODI0MTc3ODQsImlhdCI6MTY4MjQxNTk4NH0.23FzWrUg3JjTgBjZZdqOJDtu_r5QK7juMjr4gZwGxtU'
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        done()
        Toast.clear()
        return Promise.reject(error)
    }
)
// respone拦截器
service.interceptors.response.use(
    async response => {
        done()
        Toast.clear()
        const res = response.data
        // if (res.returnCode && String(res.returnCode) !== '1000') {
        //     // 登录超时,重新登录
        //     if (res.status === 401) {
        //         store.dispatch('FedLogOut').then(() => {
        //             location.reload()
        //         })
        //     }
        //     return Promise.reject(res || 'error')
        // } else {
        //     return Promise.resolve(res)
        // }
        // if (res.returnCode && res.returnCode !== '1000') {
        //     // 登录失效, 清除token, 跳转到登录页面
        //     if (res.returnCode === '9997') {
        //         wsCache.clear()
        //         Toast.fail({
        //             message: res.returnMsg,
        //             onClose: () => {
        //                 router.push({ name: 'Login' })
        //             }
        //         })
        //     } else {
        //         Toast.fail(res.returnMsg)
        //         throw new Error()
        //     }
        // } else {
        //     // 不传递默认开启loading
        //     // if (!response.config.hideloading) {
        //     //     Toast.success(res.returnMsg)
        //     // }
        // }
        try {
            await getFail(res)
            return Promise.resolve(res)
        } catch (err) {
            return Promise.reject(res || 'error')
        }
    },
    async error => {
        done()
        Toast.clear()
        const data = error.response.data
        await getFail(data)
        Toast.fail(data.returnMsg || error.message)
        return Promise.reject(data || error)
    }
)

export default service
