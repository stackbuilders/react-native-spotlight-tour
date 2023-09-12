import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
export function vwDP(percentage) {
    return responsiveWidth(percentage);
}
export function vw(percentage) {
    return `${vwDP(percentage)}px`;
}
export function vhDP(percentage) {
    return responsiveHeight(percentage);
}
export function vh(percentage) {
    return `${vhDP(percentage)}px`;
}
//# sourceMappingURL=responsive.js.map