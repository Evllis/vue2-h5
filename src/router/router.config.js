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
                meta: { title: '客户基本信息', keepAlive: false }
            },
            {
                path: 'person',
                name: 'Person',
                component: () => import('@/views/Customer/person.vue'),
                meta: { title: '企业经办人信息', keepAlive: false }
            },
            {
                path: 'operator',
                name: 'Operator',
                component: () => import('@/views/Customer/operator.vue'),
                meta: { title: '客户补充信息', keepAlive: false }
            },
            {
                path: 'list',
                name: 'List',
                component: () => import('@/views/Customer/list.vue'),
                meta: { title: '客户列表', keepAlive: false }
            },
            {
                path: 'disclaimer',
                name: 'Disclaimer',
                component: () => import('@/views/Customer/disclaimer.vue'),
                meta: { title: '免责声明', keepAlive: false }
            }
        ]
    },
    {
        path: '/cooperate',
        component: () => import('@/views/Layouts/index'),
        redirect: '/cooperate/home',
        meta: {
            title: '客户经理信息绑定',
            keepAlive: false
        },
        children: [
            {
                path: 'home',
                name: 'Cooperate',
                component: () => import('@/views/Cooperate/index'),
                meta: { title: '客户经理信息绑定', keepAlive: false }
            }
        ]
    },
    // {
    //     path: '/network',
    //     component: () => import('@/views/Layouts/index'),
    //     redirect: '/network/home',
    //     meta: {
    //         title: '入网清单',
    //         keepAlive: false
    //     },
    //     children: [
    //         {
    //             path: 'home',
    //             name: 'Network',
    //             component: () => import('@/views/Network/index'),
    //             meta: { title: '入网清单', keepAlive: false }
    //         }
    //     ]
    // },
    // {
    //     path: '/procurement',
    //     component: () => import('@/views/Layouts/index'),
    //     redirect: '/procurement/home',
    //     meta: {
    //         title: '采购清单',
    //         keepAlive: false
    //     },
    //     children: [
    //         {
    //             path: 'home',
    //             name: 'Procurement',
    //             component: () => import('@/views/Procurement/index'),
    //             meta: { title: '采购清单', keepAlive: false }
    //         }
    //     ]
    // },
    // {
    //     path: '/receipt',
    //     component: () => import('@/views/Layouts/index'),
    //     redirect: '/receipt/home',
    //     meta: {
    //         title: '合同预填写',
    //         keepAlive: false
    //     },
    //     children: [
    //         {
    //             path: 'home',
    //             name: 'Receipt',
    //             component: () => import('@/views/Receipt/index'),
    //             meta: { title: '合同预填写', keepAlive: false }
    //         }
    //     ]
    // },
    // {
    //     path: '/preview',
    //     component: () => import('@/views/Layouts/index'),
    //     redirect: '/preview/home',
    //     meta: {
    //         title: '协议预览',
    //         keepAlive: false
    //     },
    //     children: [
    //         {
    //             path: 'home',
    //             name: 'Preview',
    //             component: () => import('@/views/Preview/index'),
    //             meta: { title: '协议预览', keepAlive: false }
    //         }
    //     ]
    // },
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
            title: '收货确认单',
            keepAlive: false
        },
        children: [
            {
                path: 'home',
                name: 'Confirm',
                component: () => import('@/views/Confirm/index'),
                meta: { title: '收货确认单', keepAlive: false }
            }
        ]
    },
    {
        path: '/Sign',
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
