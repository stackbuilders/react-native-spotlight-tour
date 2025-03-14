import React, { ReactElement, ReactNode, useCallback } from "react";
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { RenderProps } from "../../SpotlightTour.context";

import { Css } from "./TourBox.styles";

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
   * Callback for when the Pause button is pressed.
   */
  onPause?: () => void;
  /**
   * Back button styles.
   */
  pauseStyle?: StyleProp<ViewStyle>;
  /**
   * Pause button text.
   */
  pauseText?: string;
  /**
   * Should show the Pause button.
   */
  showPause?: boolean;
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
 * A built-in TourBox component which can be used as a tooltip container for
 * each step. While it's highly customizable, it's not required and can be
 * replaced by your own component.
 *
 * @param props the component props
 * @returns A TourBox React element
 */
export function TourBox(props: TourBoxProps): ReactElement {
  const {
    backText = "Back",
    nextText = "Next",
    pauseText = "Pause",
    title,
    hideNext,
    hideBack,
    onBack,
    onNext,
    onPause,
    backStyle,
    nextStyle,
    titleStyle,
    style,
    children,
    isLast,
    isFirst,
    pauseStyle,
    previous,
    showPause,
    stop,
    pause,
    next,
  } = props;

  const handleBack = useCallback((): void => {
    isFirst ? stop() : previous();
    onBack?.();
  }, [isFirst, stop, previous, onBack]);

  const handleNext = useCallback((): void => {
    isLast ? stop() : next();
    onNext?.();
  }, [isLast, stop, next, onNext]);

  const handlePause = useCallback((): void => {
    pause();
    onPause?.();
  }, [pause]);

  return (
    <View style={[Css.mainView, style]}>
      {title !== undefined && (
        <Text style={[Css.titleText, titleStyle]}>
          {title}
        </Text>
      )}

      {children}

      {(!hideBack || !hideNext || showPause) && (
        <View style={Css.footerView}>
          {!hideBack && (
            <TouchableOpacity style={[Css.navButton, backStyle]} onPress={handleBack}>
              <Text>
                {backText}
              </Text>
            </TouchableOpacity>
          )}
          {showPause && (
            <TouchableOpacity style={[Css.navButton, pauseStyle]} onPress={handlePause}>
              <Text>
                {pauseText}
              </Text>
            </TouchableOpacity>
          )}
          {!hideNext && (
            <TouchableOpacity style={[Css.navButton, nextStyle]} onPress={handleNext}>
              <Text>
                {nextText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
