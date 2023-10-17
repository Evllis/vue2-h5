import types from './mutations-types'

const mutations = {
    [types.SET_SOURCE](state, data) {
        state.source = data
    },
    [types.SET_CUSTOMER_ID](state, data) {
        state.customerId = data
    },
    [types.SET_PHONE](state, data) {
        state.phone = data
    },
    [types.SET_SCROLL_TOP_MAP](state, data) {
        state.scrollTopMap = Object.assign(state.scrollTopMap, data)
    }
}

export default mutations
