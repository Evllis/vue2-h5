// const api = {
//     Login: '/user/login',
//     UserInfo: '/user/userinfo',
//     UserName: '/user/name'
// }
const isDev = process.env.VUE_APP_ENV === 'staging'
// const apiPrefix = `${isDev ? '/api' : ''}/commercial-enterprise-service`
const apiPrefix = `${isDev ? '/api' : ''}/commercial-enterprise-customer`
const api = {
    Login: {
        loginRegisterV2: `${apiPrefix}/login/loginRegister/v2`,
        sendMsg: `${apiPrefix}/login/sendMsg`
    },
    Customer: {
        editCustomerInfo: `${apiPrefix}/user/editCustomerInfo`,
        submitEnterpriseInfo: `${apiPrefix}/commercialEnterprise/submitEnterpriseInfo`,
        submitEnterpriseSocialSecurity: `${apiPrefix}/commercialEnterprise/submitEnterpriseSocialSecurity`,
        submitEnterpriseSocialSecurityV2: `${apiPrefix}/commercialEnterprise/submitEnterpriseSocialSecurity/v2`,
        findEnterpriseInfo: `${apiPrefix}/commercialEnterprise/findEnterpriseInfo`,
        findEnterpriseSocialSecurityV2: `${apiPrefix}/commercialEnterprise/findEnterpriseSocialSecurity/v2`
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
        realNameAuth: `${apiPrefix}/commercialEnterprise/realnameAuth`,
        realNameSendMsg: `${apiPrefix}/commercialEnterprise/realnameSendMsg`
    },
    Common: {
        uploadFile: `${apiPrefix}/file/uploadFile`,
        regionInfo: `${apiPrefix}/region/regionInfo`,
        updateStep: `${apiPrefix}/commercialEnterprise/updateStep`,
        queryLicenseNum: `${apiPrefix}/commercialEnterprise/queryLicenseNum`,
        getJsSdkConfig: `${apiPrefix}/weChat/getJsSdkConfig`
    }
}

export default api
