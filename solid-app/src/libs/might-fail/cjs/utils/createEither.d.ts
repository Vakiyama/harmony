import { EitherMode } from "./utils.type";
import type { Either as StandardEither } from "../Either";
import type { Either as GoEither } from "../go/Either";
export declare const createEither: <T, TEitherMode extends EitherMode = "standard">({ result, error, }: {
    error: Error;
    result: undefined;
} | {
    error: undefined;
    result: T;
}, eitherMode?: EitherMode) => TEitherMode extends "standard" ? StandardEither<T> : GoEither<T>;
//# sourceMappingURL=createEither.d.ts.map