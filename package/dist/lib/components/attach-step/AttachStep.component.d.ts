import { ReactElement, ReactNode, RefObject } from "react";
import { StyleProp } from "react-native";
export interface ChildProps<T> {
    /**
     * A React children, if any.
     */
    children?: ReactNode;
    /**
     * A React reference.
     */
    ref: RefObject<unknown>;
    /**
     * The style prop.
     */
    style: StyleProp<T>;
}
export interface AttachStepProps<T> {
    /**
     * The element in which the spotlight will be to wrapped to in the specified
     * step of the tour.
     */
    children: ReactElement<ChildProps<T>>;
    /**
     * When `AttachStep` wraps a Functional Component, it needs to add an
     * aditional `View` on top of it to be able to measure the layout upon
     * render. This prop allows to define the behavior of the width of such
     * `View`. When set to `false`, it adjusts to its contents, when set to
     * `true`, it stretches out and tries to fill it view.
     *
     * **Note:** This prop has no effect when wrapping native components or
     * componentes created with `React.forwardRef`, which pass the `ref` to
     * another native component.
     *
     * @default false
     */
    fill?: boolean;
    /**
     * The index of the `steps` array to which the step is attatched to.
     */
    index: number;
}
/**
 * React functional component used to attach and step to another component by
 * only wrapping it. Use its props to customize the behavior.
 *
 * @param props the component props
 * @returns an AttachStep React element
 */
export declare function AttachStep<T>({ children, fill, index }: AttachStepProps<T>): ReactElement;
