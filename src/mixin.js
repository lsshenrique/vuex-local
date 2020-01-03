import { warn, findParentOptionsWithLocalStore } from './util'
import { registerLocalModule, unregisterLocalModule } from './register'

export default {
    beforeCreate() {
        let name = ''

        if (this.$options.localModule) {
            const localModule = this.$options.localModule.call(this.$options.propsData);
            name = localModule.name;

            if (!name) {
                warn("Atenção, a propriedade 'name' deve ser definida em props e deve estar como obrigatório.");
                return;
            }

            registerLocalModule(this.$store, localModule, name);
        } else {
            let $options = findParentOptionsWithLocalStore(this.$parent)

            if (!$options || !$options.localModule) return;

            name = $options.localModule.call($options.propsData).name;
        }

        const store = this.$store;

        this.$get = prop => store.getters[`${name}/${prop}`];
        this.$state = store.state[`${name}`];
        this.$commit = (mutation, payload) => store.commit(`${name}/${mutation}`, payload);
        this.$dispatch = (action, payload) => store.dispatch(`${name}/${action}`, payload);
    },

    beforeDestroy() {
        if (!this.$options.localModule) return;

        const localModule = this.$options.localModule.call(this.$options.propsData);
        const name = localModule.name;

        if (!name) return;

        unregisterLocalModule(this.$store, name);
    }
}