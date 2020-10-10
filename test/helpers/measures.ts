export interface MeasureOnSuccessCallbackParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const viewMockMeasureData: MeasureOnSuccessCallbackParams = {
  height: 400,
  width: 200,
  x: 1,
  y: 1
};

export const buttonMockMeasureData: MeasureOnSuccessCallbackParams = {
  height: 50,
  width: 100,
  x: 10,
  y: 10
};
