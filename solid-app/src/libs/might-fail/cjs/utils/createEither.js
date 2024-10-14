"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEither = void 0;
// This is not how we intended the tuple feature to work but this is the only way we could currently get TypeScript to play nice
// this really should just be an interator on the either object, but it's much more complicated because of TS.
// All the details are in this PR https://github.com/meech-ward/might-fail/pull/7#issuecomment-2395122593 
// hopefully we can change this with a future version of TS.
const createEither = ({ result, error, }, eitherMode = "standard") => {
    if (error) {
        const array = eitherMode === "standard" ? [error, undefined] : [undefined, error];
        const obj = {};
        obj.error = error;
        obj.result = undefined;
        return createArrayProxy(obj, array);
    }
    const array = eitherMode === "standard" ? [undefined, result] : [result, undefined];
    const obj = {};
    obj.error = undefined;
    obj.result = result;
    return createArrayProxy(obj, array);
};
exports.createEither = createEither;
const createArrayProxy = (obj, array) => {
    // Proxy to intercept array methods and properties
    return new Proxy(obj, {
        get(target, prop, receiver) {
            // If the property exists on the object itself, return it
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }
            // If the property exists on the internal array, proxy it
            if (prop in array) {
                const value = array[prop]; // TypeScript array typing here
                if (typeof value === "function") {
                    // Proxy array methods
                    return function (...args) {
                        return value.apply(array, args);
                    };
                }
                else {
                    // Return array properties (like length)
                    return value;
                }
            }
            // Handle the iterator separately
            if (prop === Symbol.iterator) {
                const originalIterator = array[Symbol.iterator]();
                return function* () {
                    for (let item of originalIterator) {
                        yield item;
                    }
                };
            }
            return undefined;
        },
    });
};
//# sourceMappingURL=createEither.js.map