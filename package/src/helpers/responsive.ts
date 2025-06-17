import { responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";

export function vw(percentage: number): number {
  return responsiveScreenWidth(percentage);
}

export function vh(percentage: number): number {
  return responsiveScreenHeight(percentage);
}
