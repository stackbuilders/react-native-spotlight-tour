import React, { ReactElement, ReactNode, useCallback } from "react";
import { StyleProp, Text, TextStyle, ViewStyle } from "react-native";

import { RenderProps } from "../../SpotlightTour.context";

import { FooterContainer, MainContainer, NavButton, TitleText } from "./TourBox.styles";

interface TourBoxProps extends RenderProps {
  backStyle?: StyleProp<ViewStyle>;
  backText?: string;
  children?: ReactNode;
  hideBack?: boolean;
  hideNext?: boolean;
  nextStyle?: StyleProp<ViewStyle>;
  nextText?: string;
  onBack?: () => void;
  onNext?: () => void;
  style?: StyleProp<ViewStyle>;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
}

export function TourBox(props: TourBoxProps): ReactElement {
  const {
    backText,
    nextText,
    title,
    hideNext,
    hideBack,
    onBack,
    onNext,
    backStyle,
    nextStyle,
    titleStyle,
    style,
    children,
    isLast,
    isFirst,
    previous,
    stop,
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

  return (
    <MainContainer style={style}>
      {title && (
        <TitleText style={titleStyle}>
          {title}
        </TitleText>
      )}

      {children}

      {(!hideBack || !hideNext) && (
        <FooterContainer>
          {!hideBack && (
            <NavButton style={backStyle} onPress={handleBack}>
              <Text>
                {backText || "Back"}
              </Text>
            </NavButton>
          )}
          {!hideNext && (
            <NavButton style={nextStyle} onPress={handleNext}>
              <Text>
                {nextText || "Next"}
              </Text>
            </NavButton>
          )}
        </FooterContainer>
      )}
    </MainContainer>
  );
}
