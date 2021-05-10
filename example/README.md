# Examples
Here you will find an example of both iOS and Android implementations of `react-native-spotlight-tour`.

## Requirements
Make sure you are in the `react-native-spotlight-tour` root directory and run:
```
yarn install
``` 
This will generate the `node_modules` directory.

Then, you need to run: 
```
yarn pack
```
This will generate a `react-native-spotlight-tour-<version>.tgz` file. This file is the one that will be used by the examples. Inside the `/example` directory, you could check the `dependencies` section of the `package.json` file to verify this. 

If the library is not referenced, add it with the following command:
```
yarn add ../react-native-spotlight-tour-<version>.tgz
```

Finally, in the `/example` directory, you need to run: 
```
yarn install
```

## Running the examples

You should be located in the `/example` directory.

For running the iOS example, you need to access the directory `/ios` and use:
```
pod install
```
This will install the necessary dependencies for the project.

Then, back in the `/example` directory use:
```
yarn ios
```

For running the Android example, use:
```
yarn android
```

Finally, to start the react server you could use: 
```
yarn start
```