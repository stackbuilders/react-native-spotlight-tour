import React, { ReactElement, ReactNode, useCallback } from "react";
import { StyleProp, Text, TextStyle, ViewStyle } from "react-native";

import { RenderProps } from "../../SpotlightTour.context";

import { FooterContainer, MainContainer, NavButton, TitleText } from "./TourBox.styles";

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
    <MainContainer style={style}>
      {title !== undefined && (
        <TitleText style={titleStyle}>
          {title}
        </TitleText>
      )}

      {children}

      {(!hideBack || !hideNext || showPause) && (
        <FooterContainer>
          {!hideBack && (
            <NavButton style={backStyle} onPress={handleBack}>
              <Text>
                {backText}
              </Text>
            </NavButton>
          )}
          {showPause && (
            <NavButton style={backStyle} onPress={handlePause}>
              <Text>
                {pauseText}
              </Text>
            </NavButton>
          )}
          {!hideNext && (
            <NavButton style={nextStyle} onPress={handleNext}>
              <Text>
                {nextText}
              </Text>
            </NavButton>
          )}
        </FooterContainer>
      )}
    </MainContainer>
  );
}
