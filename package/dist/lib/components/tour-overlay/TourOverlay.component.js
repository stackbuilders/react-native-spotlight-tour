import React, { forwardRef, useCallback, useContext, useImperativeHandle, useMemo, useRef, useEffect, } from "react";
import { Animated, Modal, Platform, } from "react-native";
import { Defs, Mask, Rect, Svg } from "react-native-svg";
import { vhDP, vwDP } from "../../../helpers/responsive";
import { SpotlightTourContext, } from "../../SpotlightTour.context";
import { OverlayView } from "./TourOverlay.styles";
import { CircleShape } from "./shapes/CircleShape.component";
export const TourOverlay = forwardRef((props, ref) => {
    const { backdropOpacity, color, current, motion, nativeDriver, onBackdropPress, padding, spot, tourStep, } = props;
    const { goTo, next, previous, start, stop } = useContext(SpotlightTourContext);
    const tooltipOpacity = useRef(new Animated.Value(0));
    const useNativeDriver = useMemo(() => {
        const driverConfig = typeof nativeDriver === "boolean"
            ? { android: nativeDriver, ios: nativeDriver, web: nativeDriver }
            : nativeDriver;
        return Platform.select({
            android: driverConfig.android,
            default: false,
            ios: driverConfig.ios,
            web: driverConfig.web,
        });
    }, [nativeDriver]);
    const handleBackdropPress = useCallback(() => {
        const handler = tourStep.onBackdropPress ?? onBackdropPress;
        if (handler !== undefined && current !== undefined) {
            switch (handler) {
                case "continue":
                    return next();
                case "stop":
                    return stop();
                default:
                    return handler({ current, goTo, next, previous, start, stop });
            }
        }
    }, [tourStep, onBackdropPress, current, goTo, next, previous, start, stop]);
    useEffect(() => {
        const { height, width } = spot;
        if ([height, width].every(value => value > 0)) {
            Animated.timing(tooltipOpacity.current, {
                delay: 400,
                duration: 400,
                toValue: 1,
                useNativeDriver,
            })
                .start();
        }
    }, [spot, useNativeDriver]);
    useImperativeHandle(ref, () => ({
        hideTooltip: () => {
            return new Promise(resolve => {
                if (current !== undefined) {
                    Animated.timing(tooltipOpacity.current, {
                        duration: 400,
                        toValue: 0,
                        useNativeDriver,
                    })
                        .start(resolve);
                }
                else {
                    resolve({ finished: true });
                }
            });
        },
    }), [current, useNativeDriver]);
    return (React.createElement(Modal, { animationType: "fade", presentationStyle: "overFullScreen", transparent: true, visible: current !== undefined },
        React.createElement(OverlayView, { testID: "Overlay View" },
            React.createElement(Svg, { testID: "Spot Svg", height: "100%", width: "100%", viewBox: `0 0 ${vwDP(100)} ${vhDP(100)}`, onPress: handleBackdropPress, shouldRasterizeIOS: true, renderToHardwareTextureAndroid: true },
                React.createElement(Defs, null,
                    React.createElement(Mask, { id: "mask", x: 0, y: 0, height: "100%", width: "100%" },
                        React.createElement(Rect, { height: "100%", width: "100%", fill: "#fff" }),
                        React.createElement(CircleShape, { tourStep: tourStep, motion: tourStep.motion ?? motion, padding: padding, useNativeDriver: useNativeDriver }))),
                React.createElement(Rect, { height: "100%", width: "100%", fill: color, mask: "url(#mask)", opacity: backdropOpacity })))));
});
//# sourceMappingURL=TourOverlay.component.js.map