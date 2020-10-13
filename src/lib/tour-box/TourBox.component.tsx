import React from "react";
import { StyleProp, Text, TextStyle, ViewStyle } from "react-native";

import { RenderProps } from "../SpotlightTour.context";

import { FooterContainer, MainContainer, NavButton, TitleText } from "./TourBox.styles";

interface TourBoxProps extends RenderProps {
  backText?: string;
  nextText?: string;
  title?: string;
  hideNext?: boolean;
  hideBack?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  backStyle?: StyleProp<ViewStyle>;
  nextStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const TourBox: React.FC<TourBoxProps> = props => {
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
    descriptionStyle,
    style,
    children,
    isLast,
    isFirst,
    previous,
    stop,
    next
  } = props;

  const handleBack = () => {
    isFirst ? stop() : previous();
    onBack?.();
  };

  const handleNext = () => {
    isLast ? stop() : next();
    onNext?.();
  };

  return (
    <MainContainer style={style}>
      {title && (
        <TitleText style={titleStyle}>
          {title}
        </TitleText>
      )}

      {typeof children === "string"
        ? <Text style={descriptionStyle}>{children}</Text>
        : children
      }

      <FooterContainer>
        {
          // having a way to customize the bottom nav should be useful
        }
        {!hideBack && (
          <NavButton style={backStyle} onPress={handleBack}>
            <Text>
              {backText ?? "Back"}
            </Text>
          </NavButton>
        )}
        {!hideNext && (
          <NavButton style={nextStyle} onPress={handleNext}>
            <Text>
              {nextText ?? "Next"}
            </Text>
          </NavButton>
        )}
      </FooterContainer>
    </MainContainer>
  );
};

