const types = {
    SET_USER_NAME: 'SET_USER_NAME', // 用户名称
    SET_TOKEN: 'SET_TOKEN', // 登录token
    SET_ENTERPRISE_ID: 'SET_ENTERPRISE_ID', // 企业id
    SET_ENTERPRISE_NAME: 'SET_ENTERPRISE_NAME', // 企业名称
    SET_STEP: 'SET_STEP', // 登录步骤
    SET_EDIT_AUDIT: 'SET_EDIT_AUDIT', // 是否从查询页进入
    SET_IS_PREVIEW: 'SET_IS_PREVIEW', // 是否查看企业信息
    SET_STATUS: 'SET_STATUS' // 设置列表项目的状态
}

const getDefaultState = () => {
    return {
        userName: '',
        token: '',
        enterpriseId: '',
        enterpriseName: '',
        step: '',
        editAudit: false,
        isPreview: false,
        status: 1
    }
}

const defaultState = getDefaultState()

const getters = {
    userName: state => state.userName,
    token: state => state.token,
    enterpriseId: state => state.enterpriseId,
    enterpriseName: state => state.enterpriseName,
    step: state => state.step,
    editAudit: state => state.editAudit,
    isPreview: state => state.isPreview,
    status: state => state.status
}

const actions = {
    setUserName({ commit }, data) {
        commit(types.SET_USER_NAME, data)
    },
    setToken({ commit }, data) {
        commit(types.SET_TOKEN, data)
    },
    setEnterpriseId({ commit }, data) {
        commit(types.SET_ENTERPRISE_ID, data)
    },
    setEnterpriseName({ commit }, data) {
        commit(types.SET_ENTERPRISE_NAME, data)
    },
    setStep({ commit }, data) {
        commit(types.SET_STEP, data)
    },
    setEditAudit({ commit }, data) {
        commit(types.SET_EDIT_AUDIT, data)
    },
    setIsPreview({ commit }, data) {
        commit(types.SET_IS_PREVIEW, data)
    },
    setStatus({ commit }, data) {
        commit(types.SET_STATUS, data)
    }
}

const mutations = {
    [types.SET_USER_NAME](state, data) {
        state.userName = data
    },
    [types.SET_TOKEN](state, data) {
        state.token = data
    },
    [types.SET_ENTERPRISE_ID](state, data) {
        state.enterpriseId = data
    },
    [types.SET_ENTERPRISE_NAME](state, data) {
        state.enterpriseName = data
    },
    [types.SET_STEP](state, data) {
        state.step = data
    },
    [types.SET_EDIT_AUDIT](state, data) {
        state.editAudit = data
    },
    [types.SET_IS_PREVIEW](state, data) {
        state.isPreview = data
    },
    [types.SET_STATUS](state, data) {
        state.status = data
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
