import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export function vwDP(percentage: number): number {
  return responsiveWidth(percentage);
}

export function vw(percentage: number): string {
  return `${vwDP(percentage)}px`;
}

export function vhDP(percentage: number): number {
  return responsiveHeight(percentage);
}

export function vh(percentage: number): string {
  return `${vhDP(percentage)}px`;
}
