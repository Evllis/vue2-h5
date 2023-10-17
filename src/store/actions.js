import types from './mutations-types'

const actions = {
    setSource({ commit }, data) {
        commit(types.SET_SOURCE, data)
    },
    setCustomerId({ commit }, data) {
        commit(types.SET_CUSTOMER_ID, data)
    },
    setPhone({ commit }, data) {
        commit(types.SET_PHONE, data)
    },
    setScrollTopMap({ commit }, data) {
        commit(types.SET_SCROLL_TOP_MAP, data)
    },
    resetSettings({ commit }) {
        commit('app/RESET_SETTINGS', {}, { root: true })
        commit('sign/RESET_SETTINGS', {}, { root: true })
    }
    // 方法二
    // async fnA({ commit }, { params1, params2 }) {
    //     commit('getData', await getData())
    // },
    // async fnB({ dispatch, commit }) {
    //     await dispatch('fnA') // 等待 fnA 完成
    //     commit('getOtherData', await getOtherData())
    // }
}

export default actions
