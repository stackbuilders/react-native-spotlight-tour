import React from "react";
import { type CommonPathProps } from "react-native-svg";

declare module "react-native-svg" {

  export interface MaskProps extends CommonPathProps {
    children: React.ReactNode;
  }
}
