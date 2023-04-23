// const api = {
//     Login: '/user/login',
//     UserInfo: '/user/userinfo',
//     UserName: '/user/name'
// }
const isDev = process.env.VUE_APP_ENV === 'development'
const apiPrefix = `${isDev ? '/api' : ''}/commercial-enterprise-service`
const api = {
    Login: {
        loginRegister: `${apiPrefix}/login/loginRegister`,
        sendMsg: `${apiPrefix}/login/sendMsg`
    },
    Customer: {
        setRole: `${apiPrefix}/user/setRole`,
        submitEnterpriseInfo: `${apiPrefix}/commercialEnterprise/submitEnterpriseInfo`,
        submitEnterpriseOperator: `${apiPrefix}/commercialEnterprise/submitEnterpriseOperator`,
        submitEnterpriseSocialSecurity: `${apiPrefix}/commercialEnterprise/submitEnterpriseSocialSecurity`
    },
    Cooperate: {
        submitEnterpriseUnicomInfo: `${apiPrefix}/commercialEnterprise/submitEnterpriseUnicomInfo`
    },
    Network: {
        editSetmeal: `${apiPrefix}/commercialEnterprise/editSetmeal`,
        findSetmealList: `${apiPrefix}/commercialEnterprise/findSetmealList`
    },
    Common: {
        uploadFile: `${apiPrefix}/file/uploadFile`,
        regionInfo: `${apiPrefix}/region/regionInfo`
    }
}

export default api
