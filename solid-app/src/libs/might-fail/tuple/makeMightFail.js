import { mightFail, mightFailSync } from "./mightFail";
/**
 * Wraps a promise-returning function in another function that instead of returning a Promise directly,
 * returns a Promise that resolves with an Either tuple. This allows for the handling of both resolved values and
 * errors in a consistent, functional way.
 *
 * @export
 * @template T The function type that returns a Promise.
 * @param {T} func - The async function to be wrapped. This function should return a Promise.
 * @return {Function} A new function that, when called, returns a Promise that resolves with an Either tuple.
 * The Either tuple is [undefined, T] where T is the resolved value of the original Promise if successful,
 * or [Error, undefined] if the Promise was rejected.
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
 * const [error, result] = await safeFetchData('https://example.com');
 *
 * if (error) {
 *   console.error('Fetching failed:', error.message);
 *   return;
 * }
 * console.log('Fetched data:', result);
 */
export function makeMightFail(func) {
    return async (...args) => {
        const promise = func(...args);
        return mightFail(promise);
    };
}
/**
 * Wraps a synchronous function that might throw an exception in another function that,
 * instead of throwing, returns an Either tuple. This tuple contains either undefined as the first element
 * and the value returned by the function as the second if it executes successfully,
 * or an Error as the first element and undefined as the second if the function throws.
 *
 * @export
 * @template T The function type that might throw an error.
 * @param {T} func - The function to be wrapped. This function might throw an exception.
 * @return {Function} A new function that, when called, returns an Either tuple with either [undefined, T] or [Error, undefined].
 *
 * @example
 * // Example of wrapping a synchronous function that might throw an error:
 * function parseJSON(jsonString: string) {
 *   return JSON.parse(jsonString); // This might throw
 * }
 *
 * const safeParseJSON = makeMightFailSync(parseJSON);
 * const [error, result] = safeParseJSON('{"valid": "json"}');
 *
 * if (error) {
 *   console.error('Parsing failed:', error);
 *   return;
 * }
 * console.log('Parsed object:', result);
 */
export function makeMightFailSync(func) {
    return (...args) => {
        const throwingFunction = () => func(...args);
        return mightFailSync(throwingFunction);
    };
}
//# sourceMappingURL=makeMightFail.js.map