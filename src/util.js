export function warn(message) {
    console.error('[vuex-local] ' + message)
}

export function findParentOptionsWithLocalStore(element) {
    if (element) {
        if (element.$options.localModule) {
            return element.$options
        } else {
            return findParentOptionsWithLocalStore(element.$parent)
        }
    }
}