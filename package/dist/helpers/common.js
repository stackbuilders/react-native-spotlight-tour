/**
 * Typeguard to check if any React children is represented as a function
 * instead of a Node. I,e., when it's a {@link ChildFn}.
 *
 * @param children any React children
 * @returns true if the children is a function, false otherwise
 */
export function isChildFunction(children) {
    return typeof children === "function";
}
/**
 * Typeguard to check if any value is a {@link Promise Promise\<T\>}. It allows
 * passing the generic param `T` to be explicit about the promise type.
 *
 * @param value any value to check against the guard
 * @returns true if the value is a Promise<T>, false otherwise.
 */
export function isPromise(value) {
    const maybePromise = value;
    return typeof value === "object"
        && value !== null
        && typeof maybePromise.then === "function"
        && typeof maybePromise.catch === "function"
        && typeof maybePromise.finally === "function";
}
//# sourceMappingURL=common.js.map