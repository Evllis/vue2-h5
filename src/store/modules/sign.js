const types = {
    SET_SIGN_SUCCESS: 'SET_SIGN_SUCCESS', // 是否已签单
    SET_LINK_URL: 'SET_LINK_URL', // 分享链接
    SET_CONTRACT_CODE: 'SET_CONTRACT_CODE', // 文档名称
    SET_CUSTOMER_NAME: 'SET_CUSTOMER_NAME', // 客户名称
    SET_PDF_URL: 'SET_PDF_URL' // pdf文档地址
}

const getDefaultState = () => {
    return {
        isSignSuccess: false,
        linkUrl: '',
        contractCode: '',
        customerName: '',
        pdfUrl: ''
    }
}

const defaultState = getDefaultState()

const getters = {
    isSignSuccess: state => state.isSignSuccess,
    linkUrl: state => state.linkUrl,
    contractCode: state => state.contractCode,
    customerName: state => state.customerName,
    pdfUrl: state => state.pdfUrl
}

const actions = {
    setSignSuccess({ commit }, data) {
        commit(types.SET_SIGN_SUCCESS, data)
    },
    setLinkUrl({ commit }, data) {
        commit(types.SET_LINK_URL, data)
    },
    setContractCode({ commit }, data) {
        commit(types.SET_CONTRACT_CODE, data)
    },
    setCustomerName({ commit }, data) {
        commit(types.SET_CUSTOMER_NAME, data)
    },
    setPdfUrl({ commit }, data) {
        commit(types.SET_PDF_URL, data)
    }
}

const mutations = {
    [types.SET_SIGN_SUCCESS](state, data) {
        state.isSignSuccess = data
    },
    [types.SET_LINK_URL](state, data) {
        state.setLinkUrl = data
    },
    [types.SET_CONTRACT_CODE](state, data) {
        state.contractCode = data
    },
    [types.SET_CUSTOMER_NAME](state, data) {
        state.customerName = data
    },
    [types.SET_PDF_URL](state, data) {
        state.pdfUrl = data
    },
    BATCH_SETTINGS(state, data = {}) {
        Object.entries(data).forEach(k => (state[k[0]] = k[1]))
    },
    RESET_SETTINGS: state => Object.assign(state, getDefaultState())
}

export default {
    namespaced: true,
    state: defaultState,
    getters,
    actions,
    mutations
}
