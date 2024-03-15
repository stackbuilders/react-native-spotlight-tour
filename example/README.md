# Examples

Here you will find an example of iOS, Android, and Web implementations of `react-native-spotlight-tour`.

## Running the examples

The dependencies of the example are managed by Yarn Workspaces, so first make sure to run the following at the root of the project:

```bash
yarn install
```

For the rest of the setup, you should be located in the `example/` directory.

### iOS

For running the iOS example, you'll need to install the iOS ecosystem tools first:

```bash
bundle install
```

With that in place, you can head to the `ios/` directory and install the iOS native dependencies. Here's a shortcut command:

```bash
cd ios/ && pod install
```

Then, make sure to head back to the `example/` directory and install the app on a simulator or physical device with:

```bash
yarn ios
```

### Android

Android manages its native dependencies with Gradle, so they will be installed along with the build process. That means there's no need for additional commands, you can install the app on a simulator or physical device with:

```bash
yarn android
```

### Development server

To make sure that `react-native-spotlight-tour` source code is built before running the Metro bundler, it's better to start the development server with the `turbo` command. Head to the root of the project and run the following command:

```bash
yarn start
```

Now you can make changes to the source code of `react-native-spotlight-tour` and the app will automatically reload to use your changes on the fly.

### React Native Web

React Native Web has a bit of a different setup. First, you'll need to build the web version of the example app. Head to the `example/` directory and run the following command:

```bash
yarn web:build
```

This will create the bundled JS file `dist/index.bundle.js`, which is referenced by a script tag in `index.html`. The only thing we have left is to use a web server to serve the built files. You can do that locally using the following command:

```bash
yarn web:start
```

By default, it will create a web server on <http://localhost:3000>. You can go there in your browser to see the web version of the example app.
