# React Native Spotlight Tour

[![CI](https://github.com/stackbuilders/react-native-spotlight-tour/actions/workflows/ci.yml/badge.svg)](https://github.com/stackbuilders/react-native-spotlight-tour/actions/workflows/ci.yml)
[![Release](https://github.com/stackbuilders/react-native-spotlight-tour/actions/workflows/release.yml/badge.svg)](https://github.com/stackbuilders/react-native-spotlight-tour/actions/workflows/release.yml)
[![NPM version](https://img.shields.io/npm/v/@stackbuilders/react-native-spotlight-tour)](https://www.npmjs.com/package/@stackbuilders/react-native-spotlight-tour)
[![NPM downloads](https://img.shields.io/npm/dm/@stackbuilders/react-native-spotlight-tour)](https://www.npmjs.com/package/@stackbuilders/react-native-spotlight-tour)
[![NPM license](https://img.shields.io/npm/l/@stackbuilders/react-native-spotlight-tour)](./LICENSE)
[![GitHub Release Date](https://img.shields.io/github/release-date/stackbuilders/react-native-spotlight-tour)](https://github.com/stackbuilders/react-native-spotlight-tour/releases)
[![Snyk Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@stackbuilders/react-native-spotlight-tour)](https://snyk.io/)

`react-native-spotlight-tour` is a simple and intuitive library for React Native (Android, iOS, and Web 
compatible). It allows you to implement a highly customizable tour feature with an awesome spotlight 
effect. This library handles animations at the native level and is perfect for the following:

* Guiding users on how to use your application
* Showing an introduction to your users

<span><img src="docs/rnst-bounce.gif" alt="spotlight-bounce-gif" width="300"/></span>
<span><img src="docs/rnst-fade.gif" alt="spotlight-fade-gif" width="300"/></span>
<span><img src="docs/rnst-slide.gif" alt="spotlight-slide-gif" width="300"/></span>

## Requirements

* [ReactJS](https://reactjs.org/) >= 16.8.0
* [React Native](https://reactnative.dev/) >= 0.50.0
* [react-native-svg](https://github.com/react-native-svg/react-native-svg) >= 12.1.0

## Install

With `npm`:

```bash
$ npm install @stackbuilders/react-native-spotlight-tour
```

With `yarn`:

```bash
$ yarn add @stackbuilders/react-native-spotlight-tour
```

## Usage

To be able to use the tour, you'll need to wrap everything around a `SpotlightTourProvider`. This provider component will also give you access to a hook to retrieve the `SpotlightTour` context, which gives information and fine control over the tour.

```tsx
import { AttachStep, SpotlightTourProvider, TourStep } from "@stackbuilders/react-native-spotlight-tour";

const mySteps: TourStep[] = [
  // ...
];

return (
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
);
```

The tour requires an array of steps to be configured, which will map directly to each `<AttachStep />` index. Bellow is a complete example of a `TourStep` array:

```tsx
import {
  Align,
  Position,
  TourStep,
  useSpotlightTour
} from "@stackbuilders/react-native-spotlight-tour";

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

You can also find a complete example [here](example/).

## API Reference

To view all the types, options, and props, please check the complete [API Reference](https://stackbuilders.github.io/react-native-spotlight-tour/docs/build/) documentation.

## License

MIT, see [the LICENSE file](LICENSE).

## Contributing

Do you want to contribute to this project? Please take a look at our [contributing guideline](/docs/CONTRIBUTING.md) to know how you can help us build it.

---
<img src="https://cdn.stackbuilders.com/media/images/Sb-supports.original.png" alt="Stack Builders" width="50%"></img>  
[Check out our libraries](https://github.com/stackbuilders/) | [Join our team](https://www.stackbuilders.com/join-us/)

