export function mapState(map) {
    let fns = {}
    if (map && map.length) map.forEach(prop => fns[prop] = (vm) => vm.$state[prop])
    return fns
}

export function mapGetters(map) {
    let fns = {}
    if (map && map.length) map.forEach(prop => fns[prop] = function() {
        return this.$get(prop)
    })
    return fns
}

export function mapActions(map) {
    let fns = {}
    if (map && map.length) map.forEach(prop => fns[prop] = function(args) {
        return this.$dispatch(prop, args)
    })
    return fns
}

export function mapMutations(map) {
    let fns = {}
    if (map && map.length) map.forEach(prop => fns[prop] = function(args) {
        return this.$commit(prop, args)
    })
    return fns
}