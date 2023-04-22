const state = {
    userName: '',
    token: ''
}
const mutations = {
    SET_USER_NAME(state, name) {
        state.userName = name
    },
    SET_TOKEN(state, token) {
        state.token = token
    }
}
const actions = {
    // 设置name
    setUserName({ commit }, name) {
        commit('SET_USER_NAME', name)
    },
    setToken({ commit }, token) {
        commit('SET_TOKEN', token)
    }
}
export default {
    state,
    mutations,
    actions
}
