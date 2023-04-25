const state = {
    userName: '',
    token: '',
    enterpriseId: '',
    role: '',
    step: ''
}
const mutations = {
    SET_USER_NAME(state, name) {
        state.userName = name
    },
    SET_TOKEN(state, token) {
        state.token = token
    },
    SET_ENTERPRISE_ID(state, id) {
        state.enterpriseId = id
    },
    SET_ROLE(state, type) {
        state.role = type
    },
    SET_STEP(state, step) {
        state.step = step
    }
}
const actions = {
    // 设置name
    setUserName({ commit }, name) {
        commit('SET_USER_NAME', name)
    },
    setToken({ commit }, token) {
        commit('SET_TOKEN', token)
    },
    setEnterpriseId({ commit }, id) {
        commit('SET_ENTERPRISE_ID', id)
    },
    setRole({ commit }, type) {
        commit('SET_ROLE', type)
    },
    setStep({ commit }, step) {
        commit('SET_STEP', step)
    }
}
export default {
    state,
    mutations,
    actions
}
