import mockNativeComponent from "./test/mock.utils/mock.native.component";

export const viewMockMeasureData = {
    height: 400,
    width: 200,
    x: 1,
    y: 1
};

export const buttonMockMeasureData = {
    height: 50,
    width: 100,
    x: 10,
    y: 10
};

jest.mock("react-native/Libraries/Components/View/View", () => {

    const instanceMethods = {
        blur: jest.fn(),
        focus: jest.fn(),
        measure: jest.fn(),
        measureInWindow: (callback: any) => {
           const { x, y, width, height } = viewMockMeasureData;
            callback(x, y, width, height);
        },
        measureLayout: jest.fn(),
        setNativeProps: jest.fn()
    };

    return mockNativeComponent("react-native/Libraries/Components/View/View", instanceMethods);

}).mock("react-native/Libraries/Components/Button", () => {

    const instanceMethods = {
        blur: jest.fn(),
        focus: jest.fn(),
        measure: jest.fn(),
        measureInWindow: (callback: any) => {
            const { x, y, width, height } = buttonMockMeasureData;
            callback(x, y, width, height);
        },
        measureLayout: jest.fn(),
        setNativeProps: jest.fn()
    };

    return mockNativeComponent("react-native/Libraries/Components/Button", instanceMethods);

}).doMock("react-native/Libraries/Animated/src/AnimatedImplementation", () => {
    const ActualAnimated = jest.requireActual("react-native/Libraries/Animated/src/AnimatedImplementation");
    return {
        ...ActualAnimated,
        // TODO comment could be useful in the future just ot avoid TS conflics
        //  timing: (value: any, config: any) => {
        timing: () => {
            return {
                start: (callback: any) => {
                    callback({ finished: true });
                }
            };
        }
    };
});

