import { type Either } from "./Either";
import { mightFail, mightFailSync, Might, Fail } from "./mightFail";
import { makeMightFail, makeMightFailSync } from "./makeMightFail";
export { Either, mightFail, makeMightFail, mightFailSync, makeMightFailSync, Might, Fail };
declare const defaultExport: {
    mightFail: import("./utils/utils.type").MightFail<"standard">;
    makeMightFail: typeof makeMightFail;
    mightFailSync: <T>(func: () => T) => Either<T>;
    makeMightFailSync: typeof makeMightFailSync;
    Might: <T>(result: import("./utils/utils.type").NotUndefined<T>) => Either<T>;
    Fail: <T = any>(error: unknown) => Either<T>;
};
export default defaultExport;
//# sourceMappingURL=index.d.ts.map