import { flip, offset, shift } from "@floating-ui/react-native";
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState, } from "react";
import { isChildFunction } from "../helpers/common";
import { SpotlightTourContext, ZERO_SPOT, } from "./SpotlightTour.context";
import { TourOverlay } from "./components/tour-overlay/TourOverlay.component";
const DEFAULT_FLOATING_PROPS = {
    middleware: [flip(), offset(4), shift()],
    placement: "bottom",
};
/**
 * React provider component to get access to the SpotlightTour context.
 */
export const SpotlightTourProvider = forwardRef((props, ref) => {
    const { children, floatingProps = DEFAULT_FLOATING_PROPS, motion = "bounce", nativeDriver = true, onBackdropPress, onStop, overlayColor = "black", overlayOpacity = 0.45, spotPadding = 16, steps, } = props;
    const [current, setCurrent] = useState();
    const [spot, setSpot] = useState(ZERO_SPOT);
    const overlay = useRef({
        hideTooltip: () => Promise.resolve({ finished: false }),
    });
    const renderStep = useCallback((index) => {
        const step = steps[index];
        if (step !== undefined) {
            return Promise.all([
                overlay.current.hideTooltip(),
                Promise.resolve().then(step.before),
            ]).then(() => setCurrent(index));
        }
    }, [steps]);
    const changeSpot = useCallback((newSpot) => {
        setSpot(newSpot);
    }, []);
    const start = useCallback(() => {
        renderStep(0);
    }, [renderStep]);
    const stop = useCallback(() => {
        setCurrent(prev => {
            if (prev !== undefined) {
                onStop?.({ index: prev, isLast: prev === steps.length - 1 });
            }
            return undefined;
        });
        setSpot(ZERO_SPOT);
    }, [onStop]);
    const next = useCallback(() => {
        if (current !== undefined) {
            current === steps.length - 1
                ? stop()
                : renderStep(current + 1);
        }
    }, [stop, renderStep, current, steps.length]);
    const previous = useCallback(() => {
        if (current !== undefined && current > 0) {
            renderStep(current - 1);
        }
    }, [renderStep, current]);
    const goTo = useCallback((index) => {
        renderStep(index);
    }, [renderStep]);
    const currentStep = useMemo(() => {
        const step = current !== undefined
            ? steps[current]
            : undefined;
        return step ?? { floatingProps, render: () => React.createElement(React.Fragment, null) };
    }, [steps, current]);
    const floatingUiConfigurations = useMemo(() => currentStep.floatingProps ?? floatingProps, [floatingProps, currentStep]);
    const tour = useMemo(() => ({
        changeSpot,
        current,
        floatingProps: floatingUiConfigurations,
        goTo,
        next,
        previous,
        spot,
        start,
        steps,
        stop,
    }), [changeSpot, current, floatingUiConfigurations, goTo, next, previous, spot, start, steps, stop]);
    useImperativeHandle(ref, () => ({
        current,
        goTo,
        next,
        previous,
        start,
        stop,
    }));
    return (React.createElement(SpotlightTourContext.Provider, { value: tour },
        isChildFunction(children)
            ? React.createElement(SpotlightTourContext.Consumer, null, children)
            : React.createElement(React.Fragment, null, children),
        React.createElement(TourOverlay, { backdropOpacity: overlayOpacity, color: overlayColor, current: current, motion: motion, nativeDriver: nativeDriver, onBackdropPress: onBackdropPress, padding: spotPadding, ref: overlay, spot: spot, tourStep: currentStep })));
});
//# sourceMappingURL=SpotlightTour.provider.js.map