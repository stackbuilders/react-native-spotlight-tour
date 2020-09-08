# react-native-spotlight-tour
For React Native applications. This library allows you to implement a highly customizable application tour feature with an awesome spotlight effect.

(WIP, we could add a gif here to show the effect)

## Requirements
* react >= 16.8.0
* react-native >= 0.50.0
* react-native-svg >= 12.1.0

## Installation
* Using `npm`

    ```sh
    $ npm install react-native-spotlight-tour
    ```
* Using `yarn`

    ```sh
    $ yarn add react-native-spotlight-tour
    ```

## Basic usage (WIP)

The `SpotlightTourProvider` allows you to wrap the section of the app we want to implement a tour. This provider receive the following properties:

| Prop | Description |
| ------ | ------ |
|`ref`| Defines a mutable object for the Tour. This object will be populated through the provider. It is optional.|
|`steps`| Receives an array of `TourStep`. This array will have the steps for the tour application. [Here](#set-tour-steps) you can find more info about it.|
|`overlayColor`| Defines a color for the overlay. The value could be a string, number or rgbaArray. This property is optional and the color `black` is defined by default. |
|`overlayOpacity`| Defines the opacity of the overlay. The value could be a number or strieng. This property is optional and the value `0.45` is defined by default. |


The `AttachStep` helps to wrap a part of the code that the tour will circle and display the effect. It receives the following properties: index and disabled

| Prop | Description |
| ------ | ------ |
| `index` | Receives a number. It defines de number of secuence wich the area should be circle. |
| `disabled` | It is an optional prop and receives a boolean. It defines if the circled area should be displayed or not. The value `false` is defined by default. |


Example:

```jsx
import {
  AttachStep,
  SpotlightTourProvider
} from 'react-native-spotligh-tour'

...
return (
    <SpotlightTourProvider
      steps={myTourSteps}
      overlayColor={'gray'}
      overlayOpacity={0.36}
    >
      <View>
        <View>
          <Text>This component is part of my app tour</Text>
          <AttachStep index={0}>
            <TouchableOpacity><Text>Say Hello</Text></TouchableOpacity>
          <AttachStep>
        </View>
        ...
      </View>
    </SpotligthTourProvider>
);
```

### Set Tour Steps

The `TourStep` type has the following properties: `alignTo`, `position` and `render`. To set the `alignTo` and `position` properties you could use the following enums which are exported by the library:
* `Align`: has `SCREEN` and `SPOT` values.
* `Position`: has `BOTTOM`, `LEFT`, `RIGHT` and `TOP` values.

The `render` property receives a function that returns a component. Example:

```jsx
import {
  Align,
  TourStep,
  Position
} from "react-native-spotlight-tour";

const myTourSteps: TourStep = [
  {
    alignTo: Align.SCREEN,
    position: Position.BOTTOM,
    render: () => (
      <View>
        <Text>Step 1</Text>
      </View>
    ),
  },
  {
    alignTo: Align.SPOT,
    position: Position.LEFT,
    render: () => (
      <View>
        <Text>Step 2</Text>
      </View>
    ),
  },
];

```


## Advanced usage (WIP)

## Contributing

Contributions are always welcome! If you are interested in contribuiting, please checkout our [Conduct Code](CODE_OF_CONDUCT).

## License

[MIT License](LICENSE).
