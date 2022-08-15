# example-install.sh
#!/bin/bash

echo "Cleaning previous build..."
rm -rf ./build ./dist ./*.tgz

echo "Creating the dev package..."
yarn compile
yarn build
yarn pack --out %s-%v.tgz

echo "Installing dev package on SpotlightExample app..."
cd example
yarn remove @stackbuilders/react-native-spotlight-tour
yarn cache clean --mirror
yarn add @stackbuilders/react-native-spotlight-tour@file:../@stackbuilders-react-native-spotlight-tour-0.0.0.tgz

echo "Done!"
