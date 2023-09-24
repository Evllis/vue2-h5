const state = {
    userName: '',
    token: '',
    enterpriseId: '',
    step: '',
    editAudit: false
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
    SET_STEP(state, step) {
        state.step = step
    },
    SET_EDIT_AUDIT(state, edit) {
        state.editAudit = edit
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
    setStep({ commit }, step) {
        commit('SET_STEP', step)
    },
    setEditAudit({ commit }, edit) {
        commit('SET_EDIT_AUDIT', edit)
    }
}
export default {
    state,
    mutations,
    actions
}
