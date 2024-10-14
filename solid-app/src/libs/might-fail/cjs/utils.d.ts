import { EitherMode, MightFailFunction } from "./utils.type";
export declare function handleError(error: unknown): Error;
export declare const makeProxyHandler: <TMightFailFunction extends MightFailFunction<EitherMode>>(mightFailFunction: TMightFailFunction) => {
    get(_: TMightFailFunction, property: string): Promise<({
        error: Error;
        result: undefined;
    } & [Error, undefined]) | ({
        error: Error;
        result: undefined;
    } & [undefined, Error]) | ({
        result: never;
        error: undefined;
    } & [undefined, never]) | ({
        result: never;
        error: undefined;
    } & [never, undefined])> | ((...args: any[]) => Promise<({
        error: Error;
        result: undefined;
    } & [Error, undefined]) | ({
        error: Error;
        result: undefined;
    } & [undefined, Error]) | ({
        result: unknown;
        error: undefined;
    } & [undefined, unknown]) | ({
        result: unknown;
        error: undefined;
    } & [unknown, undefined])>);
};
//# sourceMappingURL=utils.d.ts.map