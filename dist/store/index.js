import storage from './storage.js';
export default class Store {
    #subscribers = new Set();
    #state;
    #worker;
    constructor(container, worker) {
        this.#worker = worker;
        container.addEventListener('dispatch', ({ detail: { actionType, data } }) => {
            this.dispatch(actionType, data);
        });
    }
    dispatch(actionType, data = {}) {
        window.requestAnimationFrame(() => {
            console.info(`%c[[%c${actionType}%c]]`, 'color: #ee8', 'color: #8ee', 'color: #ee8', data);
            this.#worker(actionType)(this, data);
        });
    }
    register(viewStore) {
        this.#subscribers.add(viewStore);
    }
    deregister(viewStore) {
        this.#subscribers.delete(viewStore);
    }
    publish() {
        window.requestAnimationFrame(() => {
            this.#subscribers.forEach((subscriber) => {
                subscriber.update(this.#state);
            });
        });
    }
    setValue(state, needUpdate = true) {
        window.requestAnimationFrame(() => {
            this.#state = { ...this.#state, ...state };
            if (needUpdate) {
                const newStorage = Object.entries(state);
                newStorage.forEach(([k, v]) => storage.set(k, v));
            }
            this.publish();
        });
    }
    get(prop) {
        return this.#state[prop];
    }
}
export const connectStore = (() => {
    let closureStore;
    return (elem, worker) => {
        if (!closureStore) {
            if (!elem || !worker)
                throw Error('unable to initialize store');
            closureStore = new Store(elem, worker);
        }
        return closureStore;
    };
})();
//# sourceMappingURL=index.js.map