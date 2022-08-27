export const mapState = normalizeNamespace((namespace, states) => {
    let fns = {}

    normalizeMap(states).forEach(({ key, val }) => {
        fns[key] = function mappedState() {
                let state = this.$state
                let getters = this.$getters

                if (namespace) {
                    const rootNamespace = this._rootNamespace ? this._rootNamespace + '/' : ''
                    const module = getModuleByNamespace(this.$store, 'mapState', rootNamespace + namespace)

                    if (!module) {
                        return
                    }

                    state = module.context.state
                    getters = module.context.getters
                }
                return typeof val === 'function' ?
                    val.call(this, state, getters) :
                    state[val]
            }
            // mark vuex getter for devtools
        fns[key].vuex = true
    })

    return fns
})

export function mapGetters(map) {
    let fns = {}
    if (map && map.length) map.forEach(prop => fns[prop] = function() {
        return this.$get(prop)
    })
    return fns
}

export const mapActions = normalizeNamespace((namespace, actions) => {
    let fns = {}

    normalizeMap(actions).forEach(({ key, val }) => {
        fns[key] = function mappedAction(...args) {
            // get dispatch function from store
            let dispatch = this.$dispatch

            if (namespace) {
                const rootNamespace = this._rootNamespace ? this._rootNamespace + '/' : ''
                const module = getModuleByNamespace(this.$store, 'mapActions', rootNamespace + namespace)

                if (!module) {
                    return
                }

                dispatch = module.context.dispatch
            }

            return typeof val === 'function' ?
                val.apply(this, [dispatch].concat(args)) :
                dispatch.apply(this.$store, [val].concat(args))
        }
    })

    return fns
})

/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as the first param, it can accept another params. You can commit mutation and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
export const mapMutations = normalizeNamespace((namespace, mutations) => {
    const res = {}

    normalizeMap(mutations).forEach(({ key, val }) => {
        res[key] = function mappedMutation(...args) {
            // Get the commit method from store
            let commit = this.$commit

            if (namespace) {
                const rootNamespace = this._rootNamespace ? this._rootNamespace + '/' : ''
                const module = getModuleByNamespace(this.$store, 'mapMutations', rootNamespace + namespace)

                if (!module) {
                    return
                }

                commit = module.context.commit
            }

            return typeof val === 'function' ?
                val.apply(this, [commit].concat(args)) :
                commit.apply(this.$store, [val].concat(args))
        }
    })
    return res
})

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap(map) {
    if (!isValidMap(map)) {
        return []
    }
    return Array.isArray(map) ?
        map.map(key => ({ key, val: key })) :
        Object.keys(map).map(key => ({ key, val: map[key] }))
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap(map) {
    return Array.isArray(map) || isObject(map)
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace(fn) {
    return (namespace, map) => {
        if (typeof namespace !== 'string') {
            map = namespace
            namespace = ''
        } else if (namespace.charAt(namespace.length - 1) !== '/') {
            namespace += '/'
        }
        return fn(namespace, map)
    }
}


/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace(store, helper, namespace) {
    const module = store._modulesNamespaceMap[namespace]
    if (!module) {
        console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
    }
    return module
}