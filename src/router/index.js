import Vue from 'vue'
import Router from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { constantRouterMap, asyncRouterMap } from './router.config.js'
import { useTitle } from '@/hooks/useTitle'
// import { useCache } from '@/hooks/useCache'

// const { wsCache } = useCache()

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const createRouter = () =>
    new Router({
        // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
        // base: process.env.BASE_URL,
        scrollBehavior: () => ({ y: 0 }),
        routes: cloneDeep(constantRouterMap).concat(asyncRouterMap)
    })

const router = createRouter()

// const whiteList = ['/login'] // 不重定向白名单

// TODO 待更新路由守卫配置

router.beforeEach(async (to, from, next) => {
    // const token = router.app.$options.store.getters.token
    // if (to.path !== '/login' && !token) {
    //     next({
    //         path: '/login'
    //     })
    // } else {
    //     if (to.path === '/login' && token) {
    //         next('/dashboard')
    //     } else {
    //         next()
    //     }
    // }
    next()
})

router.afterEach(to => {
    if (to && to.meta && to.meta.title) {
        useTitle(to.meta.title)
    }
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
