export const makeProxyHandler = (mightFailFunction) => ({
    get(_, property) {
        if (Object.getOwnPropertyDescriptor(Promise, property) === undefined) {
            return mightFailFunction(Promise.reject(new Error(`property ${property} not found on Promise`)));
        }
        const value = Promise[property];
        if (typeof value !== "function") {
            return mightFailFunction(Promise.reject(new Error(`property ${property} is not a Promise method`)));
        }
        return function (...args) {
            const promise = value.apply(Promise, args);
            return mightFailFunction(promise);
        };
    },
});
//# sourceMappingURL=staticMethodsProxy.js.map