export function registerLocalModule(store, module, namespace) {
    if (!(store && store.state && store.state[namespace])) {
        module.namespaced = true
        store.registerModule(namespace, module)
    }
}

export function unregisterLocalModule(store, modulePath) {
    store.unregisterModule(modulePath)
}