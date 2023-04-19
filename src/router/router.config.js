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

export const asyncRouterMap = [
    {
        path: '/customer',
        component: () => import('@/views/Layouts/index'),
        redirect: '/customer/home',
        meta: {
            title: '客户',
            keepAlive: false
        },
        children: [
            {
                path: 'home',
                name: 'Customer',
                component: () => import('@/views/Customer/index'),
                meta: { title: '客户', keepAlive: false }
            },
            {
                path: 'enterprise',
                name: 'Enterprise',
                component: () => import('@/views/Customer/enterprise.vue'),
                meta: { title: '企业基本信息', keepAlive: false }
            },
            {
                path: 'person',
                name: 'Person',
                component: () => import('@/views/Customer/person.vue'),
                meta: { title: '法人', keepAlive: false }
            },
            {
                path: 'operator',
                name: 'Operator',
                component: () => import('@/views/Customer/operator.vue'),
                meta: { title: '经办人', keepAlive: false }
            }
        ]
    }
]
