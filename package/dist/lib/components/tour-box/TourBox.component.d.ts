import { ReactElement, ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { RenderProps } from "../../SpotlightTour.context";
export interface TourBoxProps extends RenderProps {
    /**
     * Back button styles.
     */
    backStyle?: StyleProp<ViewStyle>;
    /**
     * Back button text.
     *
     * @default Back
     */
    backText?: string;
    /**
     * The TourBox content.
     */
    children?: ReactNode;
    /**
     * Should hide the Back button.
     */
    hideBack?: boolean;
    /**
     * Should hide the Next button.
     */
    hideNext?: boolean;
    /**
     * Next button styles.
     */
    nextStyle?: StyleProp<ViewStyle>;
    /**
     * Next button text.
     *
     * @default Next
     */
    nextText?: string;
    /**
     * Callback for when the Back button is pressed.
     */
    onBack?: () => void;
    /**
     * Callback for when the Next button is pressed.
     */
    onNext?: () => void;
    /**
     * TourBox main container styles.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * TourBox title text.
     */
    title?: string;
    /**
     * TourBox title styles.
     */
    titleStyle?: StyleProp<TextStyle>;
}
/**
 * A built-in TourBox component which can be used as a tooltip containder for
 * each step. While it's highly customizable, it's not required and can be
 * replaced by your own component.
 *
 * @param props the component props
 * @returns A TourBox React element
 */
export declare function TourBox(props: TourBoxProps): ReactElement;
