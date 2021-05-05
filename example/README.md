# Examples
Here you will find both iOS and Android implementations of `react-native-spotlight-tour`.

## Requirements
Be sure you are in the `react-native-spotlight-tour` root directory and run:
```
yarn install
``` 
This will generate the `node_modules` directory.

Then, you need to run: 
```
yarn pack
```
This will generate a `react-native-spotlight-tour-<version>.tgz` file. This file is the one that will be used by the examples. Inside the `/example` directory, you could check the `dependencies` section of the `package.json` file to verify this.

Finally, in the `/example` directory, you need to run: 
```
yarn install
```

## Running the examples

You should be located in the `/example` directory.

For running the iOS example, run:
```
yarn ios
```

For running the Android example, run:
```
yarn android
```