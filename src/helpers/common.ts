export type ChildFn<T> = (value: T) => React.ReactNode;

export function isChildFunction<T>(children: React.ReactNode | ChildFn<T>): children is ChildFn<T> {
  return typeof children === "function";
}

export function isPromise<T>(value?: any): value is Promise<T> {
  return typeof(value?.then) === "function";
}
