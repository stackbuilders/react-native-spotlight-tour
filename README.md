# react-native-spotlight-tour
`react-native-spotlight-tour` is a simple and intuitive library for React Native (Android and iOS 
compatible). It allows you to implement a highly customizable tour feature with an awesome 
spotlight effect with animations at the native level. This library is perfect for the following:

* Guiding users on how to use your application
* Showing an introduction to your users

<img src="tour-demo.gif" alt="spotlight" width="200"/>

## Requirements
* react >= 16.8.0
* react-native >= 0.50.0
* react-native-svg >= 12.1.0

## Installation
With `npm`:
```sh
$ npm install react-native-spotlight-tour
```

With `yarn`:
```sh
$ yarn add react-native-spotlight-tour
```

## Basic usage

```tsx
import { AttachStep, SpotlightTourProvider, TourStep } from "react-native-spotligh-tour";

const mySteps: TourStep[] = [
  ...
];

...
  <SpotlightTourProvider steps={mySteps} overlayColor={"gray"} overlayOpacity={0.36}>
    {({ start }) => (
      <>
        <Button title="Start" onPress={start} />

        <View>
          <AttachStep index={0}>
            <Text>Introduction</Text>
          </AttachStep>

          <Text>
            This is an example using the spotlight-tour library.
            Press the Start button to see it in action.
          </Text>
        </View>

        <View>
          <AttachStep index={1}>
            <TitleText>Documentation</TitleText>
          </AttachStep>
          <DescriptionText>
            Please, read the documentation before installing.
          </DescriptionText>
        </View>
      </>
    )};
  </SpotlightTourProvider>
  ...
```

### SpotlightTourProvider

The `SpotlightTourProvider` allows you to wrap a section of the application to implement 
the spotlight tour. In this section, you can define a component that will trigger the tour sequence. 
For example, a button with an `onPress` handler that will allow you to call the provided `start()` 
method to start the tour workflow. To customize and set up this workflow, you should pass a list 
of `steps` to the `SpotlightTourProvider`. 
[Check out the tour steps section](#setting-tour-steps) for more details.

Once the tour starts, an overlay component will be shown to highlight a component from the section.
This library shows an overlay component that darkens other UI elements on the screen so that users 
can focus on the children's components of `AttachStep`.


| Prop             | Required? | Default | Description |
| ---------------- | :-------: | ------- | ----------- |
| `ref`            | No        | N/A     | Mutable object for the Tour. Populated through the provider. |
| `steps`          | Yes       | N/A     | Steps for the tour (array of `TourStep`).|
| `overlayColor`   | No        | `black` | Color for the overlay (`String`, `Number` or `rgbaArray`). |
| `overlayOpacity` | No        | `0.45`  | Opacity of the overlay (`Number` or `String`) |


| Method     | Description |
| ---------- | ----------- |
| `start`    | Begin the tour. |
| `next`     | Navigate to the next defined step. |
| `previous` | Navigate to the previous step. |
| `stop`     | Finish the tour. |

### AttachStep

The `AttachStep` wraps the components that will be highlighted by the library. It receives the 
following properties:

| Prop       | Required? | Default  | Description |
| ---------- | :-------: | -------- | ----------- |
| `index`    | Yes       | N/A      | Defines the order for the tour sequence (`Number`). |
| `disabled` | No        | `false`  | Defines if the library should highlight the component or not (`Boolean`). |


### Setting Tour Steps

The `TourStep` lets you render a component with the information you want to display for each step in the tour. It has the following properties:
| Prop       | Required? | Description |
| ---------- | :-------: | ----------- |
| `alignTo`  | No        | Aligns the step component to the `Align.SPOT` or the `Align.SCREEN`. Defaults to `Align.SPOT` |
| `before`   | No        | If present, runs an operation before the step start. The function can return either `void`, or `Promise<void>`. |
| `render`   | Yes       | A function component that will be rendered in the step. The props of this component should include the [RenderProps](#render-props). |
| `position` | Yes       | The position with respect to the spot where the step component should be rendered: Possible values are `Position.BOTTOM`, `Position.LEFT`, `Position.RIGHT`, or `Position.TOP` |

#### Render props
These props will be passed to the function component of `render` in a `TourStep` object. It contains the following:
| Prop       | Type         | Description |
| ---------- | ------------ | ----------- |
| `current`  | `number`     | The current step index. Starting from `0`. |
| `isFirst`  | `boolean`    | True if the current step is the first step. False otherwise. |
| `isLast`   | `boolean`    | True if the current step is the last step. False otherwise. |
| `next`     | `() => void` | Calling it will trigger the next step (if any). |
| `previous` | `() => void` | Calling it will trigger the previous step (if any). |
| `stop`     | `() => void` | Calling it will end the tour. |

Bellow is a complete example of a `TourStep` array:

```tsx
import {
  Align,
  Position,
  TourStep,
  useSpotlightTour
} from "react-native-spotlight-tour";

const mySteps: TourStep[] = [{
  alignTo: Align.SCREEN,
  position: Position.BOTTOM,
  render: ({ next }) => (
    <View>
      <Text>This is the first step of tour!</Text>
      <Button title="Next" onPress={next} />
    </View>
  )
}, {
  alignTo: Align.SPOT,
  before: () => {
    return DataService.fetchData()
      .then(setData);
  },
  position: Position.RIGHT,
  render: () => {
    // You can also use the hook inside the step component!
    const { previous, stop } = useSpotlightTour();

    return (
      <View>
        <Text>This is the first step of tour!</Text>
        <Button title="Previous" onPress={previous} />
        <Button title="Stop" onPress={stop} />
      </View>
    );
  }
}];
```

Check out the complete example [here](example/).


## Contributing

Contributions are always welcome! If you are interested in contributing, please check out our [Conduct Code](CODE_OF_CONDUCT.md).

To run the library code locally, please consider the following versions:
* nodejs >= 14.7.0
* yarn >= 1.22.4

## License

[MIT License](LICENSE).
