"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMightFail = makeMightFail;
exports.makeMightFailSync = makeMightFailSync;
const mightFail_1 = require("./mightFail");
/**
 * Wraps a promise-returning function in another function that instead of returning a Promise directly,
 * returns a Promise that resolves with an Either. This allows for the handling of both resolved values and
 * errors in a consistent, functional way.
 *

 * @template T The function type that returns a Promise.
 * @param {T} func - The async function to be wrapped. This function should return a Promise.
 * @return {Function} A new function that, when called, returns a Promise that resolves with an Either object.
 * The Either object contains either a 'result' with the resolved value of the original Promise, or an 'error' if the Promise was rejected.
 *
 * @example
 * // Example of wrapping an async function that might fail:
 * async function fetchData(url: string): Promise<string> {
 *   const response = await fetch(url);
 *   if (!response.ok) {
 *     throw new Error('Network response was not ok');
 *   }
 *   return response.text();
 * }
 *
 * const safeFetchData = makeMightFail(fetchData);
 * const {error, result} = await safeFetchData('https://example.com');
 *
 * if (error) {
 *   console.error('Fetching failed:', error.message);
 *   return
 * }
 * console.log('Fetched data:', result);
 */
function makeMightFail(func) {
    return async (...args) => {
        const promise = func(...args);
        return (0, mightFail_1.mightFail)(promise);
    };
}
/**
 * Wraps a synchronous function that might throw an exception in another function that,
 * instead of throwing, returns an Either object. This object contains either a 'result'
 * with the value returned by the function if it executes successfully, or an 'error' if the function throws.
 *

 * @template T The function type that might throw an error.
 * @param {T} func - The function to be wrapped. This function might throw an exception.
 * @return {Function} A new function that, when called, returns an Either object with either a 'result' or an 'error'.
 *
 * @example
 * // Example of wrapping a synchronous function that might throw an error:
 * function parseJSON(jsonString: string) {
 *   return JSON.parse(jsonString); // This might throw
 * }
 *
 * const safeParseJSON = makeMightFailSync(parseJSON);
 * const {error, result} = safeParseJSON('{"valid": "json"}');
 *
 * if (error) {
 *   console.error('Parsing failed:', error);
 *   return;
 * }
 * console.log('Parsed object:', result);
 */
function makeMightFailSync(func) {
    return (...args) => {
        const throwingFunction = () => func(...args);
        return (0, mightFail_1.mightFailSync)(throwingFunction);
    };
}
//# sourceMappingURL=makeMightFail.js.map