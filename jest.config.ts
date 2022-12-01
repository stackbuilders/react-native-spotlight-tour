import { Config } from "jest";

const jestConfig: Config = {
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  preset: "react-native",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  testRegex: "test/.*\\.test\\.(tsx?)$",
  transform: {
    "^.+\\.jsx$": "babel-jest",
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
  },
  transformIgnorePatterns: [
    "node_modules/jest-runner",
    "node_modules/(!react-native)",
    "node_modules/(!@react-native-community)",
  ],
};

export default jestConfig;
