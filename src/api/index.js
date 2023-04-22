// const api = {
//     Login: '/user/login',
//     UserInfo: '/user/userinfo',
//     UserName: '/user/name'
// }
const api = {
    Login: {
        loginRegister: '/api/commercial-enterprise-service/login/loginRegister',
        sendMsg: '/api/commercial-enterprise-service/login/sendMsg'
    },
    Customer: {
        setRole: '/api/commercial-enterprise-service/user/setRole',
        submitEnterpriseInfo: '/api/commercial-enterprise-service/commercialEnterprise/submitEnterpriseInfo'
    },
    Common: {
        uploadFile: '/api/commercial-enterprise-service/file/uploadFile'
    }
}

export default api
