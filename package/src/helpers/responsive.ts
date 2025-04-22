import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export function vw(percentage: number): number {
  return responsiveWidth(percentage);
}

export function vh(percentage: number): number {
  return responsiveHeight(percentage);
}
