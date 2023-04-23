import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import router from '@/router'

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

// request拦截器 request interceptor
service.interceptors.request.use(
    config => {
        start()
        // 不传递默认开启loading
        if (!config.hideloading) {
            // loading
            Toast.loading({
                duration: 0,
                forbidClick: false
            })
        }
        // if (store.getters.token) {
        //     config.headers['Authorization'] = store.getters.token
        // }
        config.headers['Authorization'] =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiMiIsInBob25lIjoiMTg3MzQyMjIyNjUiLCJpZCI6IjE2NDk2NTMwNzg0MTkwNzA5NzYiLCJleHAiOjE2ODIyNjQ5NzIsImlhdCI6MTY4MjI2MzE3Mn0.GWA3dAQ6mzUVn52pM_4RPMrSD734tNnFMRtwsg4J3Go'
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
    response => {
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
        if (res.returnCode && res.returnCode !== '1000') {
            // 登录失效, 清除token, 跳转到登录页面
            if (res.returnCode === '9997') {
                store.dispatch('setToken', '').then(() => {
                    Toast.fail({
                        message: res.returnMsg,
                        onClose: () => {
                            router.push({ name: 'Login' })
                        }
                    })
                })
            } else {
                Toast.fail(res.returnMsg)
                throw new Error()
            }
        } else {
            // 不传递默认开启loading
            if (!response.config.hideloading) {
                Toast.success(res.returnMsg)
            }
        }
        return Promise.resolve(res)
    },
    error => {
        done()
        Toast.clear()
        const data = error?.response?.data
        Toast.fail(data.returnMsg || error.message)
        return Promise.reject(data || error)
    }
)

export default service
