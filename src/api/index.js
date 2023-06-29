// const api = {
//     Login: '/user/login',
//     UserInfo: '/user/userinfo',
//     UserName: '/user/name'
// }
const isDev = process.env.VUE_APP_ENV === 'staging'
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
        submitEnterpriseSocialSecurity: `${apiPrefix}/commercialEnterprise/submitEnterpriseSocialSecurity`,
        findEnterpriseInfo: `${apiPrefix}/commercialEnterprise/findEnterpriseInfo`,
        findEnterpriseOperator: `${apiPrefix}/commercialEnterprise/findEnterpriseOperator`,
        findEnterpriseSocialSecurity: `${apiPrefix}/commercialEnterprise/findEnterpriseSocialSecurity`
    },
    Cooperate: {
        submitEnterpriseUnicomInfo: `${apiPrefix}/commercialEnterprise/submitEnterpriseUnicomInfo`,
        findEnterpriseUnicomInfo: `${apiPrefix}/commercialEnterprise/findEnterpriseUnicomInfo`
    },
    Network: {
        editSetmeal: `${apiPrefix}/commercialEnterprise/editSetmeal`,
        findSetmealList: `${apiPrefix}/commercialEnterprise/findSetmealList`
    },
    Procurement: {
        findBuyList: `${apiPrefix}/commercialEnterprise/findBuyList`,
        editBuy: `${apiPrefix}/commercialEnterprise/editBuy`
    },
    Receipt: {
        submitEnterpriseContract: `${apiPrefix}/commercialEnterprise/submitEnterpriseContract`,
        findEnterpriseContract: `${apiPrefix}/commercialEnterprise/findEnterpriseContract`
    },
    Preview: {
        enterpriseContractPreview: `${apiPrefix}/commercialEnterprise/enterpriseContractPreview`
    },
    Audit: {
        queryAudit: `${apiPrefix}/commercialEnterprise/queryAudit`,
        auditStatusFourSubmit: `${apiPrefix}/commercialEnterprise/auditStatusFourSubmit`
    },
    Sign: {
        signContract: `${apiPrefix}/commercialEnterprise/signContract`,
        getRealName: `${apiPrefix}/commercialEnterprise/getRealname`,
        realNameAuth: `${apiPrefix}/commercialEnterprise/realnameAuth`
    },
    Common: {
        uploadFile: `${apiPrefix}/file/uploadFile`,
        regionInfo: `${apiPrefix}/region/regionInfo`,
        updateStep: `${apiPrefix}/commercialEnterprise/updateStep`,
        queryLicenseNum: `${apiPrefix}/commercialEnterprise/queryLicenseNum`
    }
}

export default api
