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
            title: '补充信息',
            keepAlive: false
        },
        children: [
            {
                path: 'home',
                name: 'Customer',
                component: () => import('@/views/Customer/index'),
                meta: { title: '补充信息', keepAlive: false }
            },
            {
                path: 'enterprise',
                name: 'Enterprise',
                component: () => import('@/views/Customer/enterprise.vue'),
                meta: { title: '客户基本信息', keepAlive: true }
            },
            {
                path: 'operator',
                name: 'Operator',
                component: () => import('@/views/Customer/operator.vue'),
                meta: { title: '客户补充信息', keepAlive: true }
            },
            {
                path: 'list',
                name: 'List',
                component: () => import('@/views/Customer/list.vue'),
                meta: { title: '客户列表', keepAlive: true }
            },
            {
                path: 'disclaimer',
                name: 'Disclaimer',
                component: () => import('@/views/Customer/disclaimer.vue'),
                meta: { title: '免责声明', keepAlive: false }
            },
            {
                path: 'process',
                name: 'Process',
                component: () => import('@/views/Customer/process.vue'),
                meta: { title: '查看进度', keepAlive: false }
            }
        ]
    },
    {
        path: '/audit',
        component: () => import('@/views/Layouts/index'),
        redirect: '/audit/home',
        meta: {
            title: '审核结果',
            keepAlive: false
        },
        children: [
            {
                path: 'home',
                name: 'Audit',
                component: () => import('@/views/Audit/index'),
                meta: { title: '审核结果', keepAlive: false }
            }
        ]
    },
    {
        path: '/confirm',
        component: () => import('@/views/Layouts/index'),
        redirect: '/confirm/home',
        meta: {
            title: '签收确认单',
            keepAlive: false
        },
        children: [
            {
                path: 'home',
                name: 'Confirm',
                component: () => import('@/views/Confirm/index'),
                meta: { title: '签收确认单', keepAlive: false }
            }
        ]
    },
    {
        path: '/sign',
        component: () => import('@/views/Layouts/index'),
        redirect: '/sign/home',
        meta: {
            title: '签署协议',
            keepAlive: false
        },
        children: [
            {
                path: 'home',
                name: 'Sign',
                component: () => import('@/views/Sign/index'),
                meta: { title: '签署协议', keepAlive: false }
            }
        ]
    }
]
