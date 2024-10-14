import { EitherMode, MightFailFunction } from "./utils.type";
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
        error: undefined;
        result: never;
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
        error: undefined;
        result: unknown;
    } & [unknown, undefined])>);
};
//# sourceMappingURL=staticMethodsProxy.d.ts.map