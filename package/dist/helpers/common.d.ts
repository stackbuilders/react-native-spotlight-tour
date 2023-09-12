import { ReactNode } from "react";
/**
 * Like the built-in {@link Omit}, but constraints the target to extend from a
 * {@link Record} type. I.e., it's meant to be used with Records to omit
 * specified keys.
 */
export type OmitR<T extends Record<keyof unknown, unknown>, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * Makes the target optional. I.e, it can be the target type or `undefined`.
 */
export type Optional<T> = T | undefined;
/**
 * An alias of what a React child looks when passed as function.
 */
export type ChildFn<T> = (value: T) => ReactNode;
/**
 * Typeguard to check if any React children is represented as a function
 * instead of a Node. I,e., when it's a {@link ChildFn}.
 *
 * @param children any React children
 * @returns true if the children is a function, false otherwise
 */
export declare function isChildFunction<T>(children: ReactNode | ChildFn<T>): children is ChildFn<T>;
/**
 * Typeguard to check if any value is a {@link Promise Promise\<T\>}. It allows
 * passing the generic param `T` to be explicit about the promise type.
 *
 * @param value any value to check against the guard
 * @returns true if the value is a Promise<T>, false otherwise.
 */
export declare function isPromise<T>(value?: unknown): value is Promise<T>;
