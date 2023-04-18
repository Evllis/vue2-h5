/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
        path: '/',
        component: () => import('@/views/Layouts/index'),
        redirect: '/login',
        meta: {
            title: '注册登录',
            keepAlive: false
        },
        children: [
            {
                path: '/login',
                name: 'Login',
                component: () => import('@/views/Login/index'),
                meta: { title: '注册登录', keepAlive: false }
            }
        ]
    },
    {
        path: '/redirect',
        component: () => import('@/views/Layouts/index'),
        name: 'Redirect',
        children: [
            {
                path: '/redirect/:path(.*)',
                name: 'Redirect',
                component: () => import('@/views/Redirect/index')
            }
        ]
    },
    {
        path: '*',
        component: () => import('@/views/Error/index'),
        name: 'NoFind'
    }
]
