import { handleError } from "./errors";
import { createEither } from "./createEither";
export const mightFailFunction = async function (promise) {
    try {
        const result = await promise;
        return createEither({ result, error: undefined });
    }
    catch (err) {
        const error = handleError(err);
        return createEither({ error, result: undefined });
    }
};
//# sourceMappingURL=mightFailFunction.js.map