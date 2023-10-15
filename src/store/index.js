import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

import actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'

import app from './modules/app'
import sign from './modules/sign'

// 判断环境 vuex提示生产环境中不使用
const debug = process.env.VUE_APP_ENV !== 'production'

const createPersisted = createPersistedState({
    storage: window.sessionStorage
})

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        sign
    },
    state,
    actions,
    getters,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger(), createPersisted] : [createPersisted]
})

export default store
