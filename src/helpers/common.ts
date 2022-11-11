import { ReactNode } from "react";

export type ChildFn<T> = (value: T) => ReactNode;

export function isChildFunction<T>(children: ReactNode | ChildFn<T>): children is ChildFn<T> {
  return typeof children === "function";
}

export function isPromise<T>(value?: unknown): value is Promise<T> {
  const maybePromise = value as Promise<T>;

  return typeof value === "object"
    && value !== null
    && typeof maybePromise.then === "function"
    && typeof maybePromise.catch === "function"
    && typeof maybePromise.finally === "function";
}
