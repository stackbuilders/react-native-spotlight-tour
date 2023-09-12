import React, { cloneElement, useContext, useEffect, useRef } from "react";
import { View } from "react-native";
import { SpotlightTourContext } from "../../SpotlightTour.context";
/**
 * React functional component used to attach and step to another component by
 * only wrapping it. Use its props to customize the behavior.
 *
 * @param props the component props
 * @returns an AttachStep React element
 */
export function AttachStep({ children, fill = false, index }) {
    const { current, changeSpot } = useContext(SpotlightTourContext);
    const childRef = useRef(null);
    useEffect(() => {
        if (current === index) {
            childRef.current?.measureInWindow((x, y, width, height) => {
                changeSpot({ height, width, x, y });
            });
        }
    }, [changeSpot, current, index]);
    if (typeof children.type === "function") {
        const { style, ...rest } = children.props;
        const childStyle = style ?? {};
        return (React.createElement(View, { testID: "attach-wrapper-view", ref: childRef, style: { alignSelf: fill ? "stretch" : "flex-start", ...childStyle }, collapsable: false, focusable: false }, cloneElement(children, rest, children.props.children)));
    }
    return cloneElement(children, { ...children.props, ref: childRef }, children.props?.children);
}
//# sourceMappingURL=AttachStep.component.js.map