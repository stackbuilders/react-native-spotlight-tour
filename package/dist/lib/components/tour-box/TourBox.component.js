import React, { useCallback } from "react";
import { Text } from "react-native";
import { FooterContainer, MainContainer, NavButton, TitleText } from "./TourBox.styles";
/**
 * A built-in TourBox component which can be used as a tooltip containder for
 * each step. While it's highly customizable, it's not required and can be
 * replaced by your own component.
 *
 * @param props the component props
 * @returns A TourBox React element
 */
export function TourBox(props) {
    const { backText = "Back", nextText = "Next", title, hideNext, hideBack, onBack, onNext, backStyle, nextStyle, titleStyle, style, children, isLast, isFirst, previous, stop, next, } = props;
    const handleBack = useCallback(() => {
        isFirst ? stop() : previous();
        onBack?.();
    }, [isFirst, stop, previous, onBack]);
    const handleNext = useCallback(() => {
        isLast ? stop() : next();
        onNext?.();
    }, [isLast, stop, next, onNext]);
    return (React.createElement(MainContainer, { style: style },
        title !== undefined && (React.createElement(TitleText, { style: titleStyle }, title)),
        children,
        (!hideBack || !hideNext) && (React.createElement(FooterContainer, null,
            !hideBack && (React.createElement(NavButton, { style: backStyle, onPress: handleBack },
                React.createElement(Text, null, backText))),
            !hideNext && (React.createElement(NavButton, { style: nextStyle, onPress: handleNext },
                React.createElement(Text, null, nextText)))))));
}
//# sourceMappingURL=TourBox.component.js.map