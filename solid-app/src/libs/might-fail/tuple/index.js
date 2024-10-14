/**
   * @module
   *
   * This module contains the interface to use the result of mightFail as an error-first tuple.
   *
   * This mimics the behaviour of golang.
   *
   * If you want to use error-first style, use the `/tuple` module.
   *
+  * @example
+  * ```ts
+  * import { mightFail } from "@might/fail/tuple";
+  *
+  * const [result, error] = await mightFail(promise);
+  * ```
   */
import { mightFail, mightFailSync } from "./mightFail";
import { makeMightFail, makeMightFailSync } from "./makeMightFail";
export { mightFail, makeMightFail, mightFailSync, makeMightFailSync };
export default { mightFail, makeMightFail, mightFailSync, makeMightFailSync };
//# sourceMappingURL=index.js.map