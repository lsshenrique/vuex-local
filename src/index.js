import Vuex from 'vuex'
import vuexMixin from './mixin'

let Vue = null

function createStore() {
    return new Vuex.Store({})
}

export default {
    install(API) {
        if (Vue) {
            warn('already installed')
            return
        }

        Vue = API

        Vue.use(Vuex)
    }
}

export * from './map'
export { vuexMixin, createStore }