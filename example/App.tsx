/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import {
  Align,
  AttachStep,
  Position,
  SpotlightTourProvider,
  TourStep,
  useSpotlightTour,
} from "react-native-spotlight-tour";

const App=() => {
  const SpotlightTour=useSpotlightTour();

  const getTourSteps: TourStep[]=
    [
      {
        alignTo: Align.SCREEN,
        position: Position.BOTTOM,
        render: (props) => {
          const {previous, next}=useSpotlightTour();
          return (
            <View style={styles.box}>
              <Text style={styles.title}>This is the Introduction</Text>
              <View style={styles.fixToText}>
                <Button title="Previous" onPress={previous}/>
                <Button title="Next" onPress={next}/>
              </View>
            </View>
          );
        },
      },
      {
        alignTo: Align.SPOT,
        position: Position.LEFT,
        render: (props) => {
          const {previous, next}=useSpotlightTour();
          return (
            <View style={{backgroundColor: Colors.red}}>
              <Text style={styles.title}>This is See your changes</Text>
              <View style={styles.fixToText}>
                <Button title="Previous" onPress={previous}/>
                <Button title="Next" onPress={next}/>
              </View>
            </View>
          );
        },
      },
    ];

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>

          <SpotlightTourProvider
            steps={getTourSteps}
            overlayColor={"gray"}
            overlayOpacity={0.36}
          >
            {({start}) => (
              <>
                <Button title="Start" onPress={start}/>
                <View style={styles.body}>
                  <View style={styles.sectionContainer}>
                    <AttachStep index={0}>
                      <Text style={styles.sectionTitle}>Introduction</Text>
                    </AttachStep>
                    <Text style={styles.sectionDescription}>
                      Edit <Text style={styles.highlight}>App.tsx</Text> to change
                      this screen and then come back to see your edits.
                    </Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <AttachStep index={1}>
                      <Text style={styles.sectionTitle}>See Your Changes</Text>
                    </AttachStep>
                    <Text style={styles.sectionDescription}>
                      <ReloadInstructions/>
                    </Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Debug</Text>
                    <Text style={styles.sectionDescription}>
                      <DebugInstructions/>
                    </Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Learn More</Text>
                    <Text style={styles.sectionDescription}>
                      Read the docs to discover what to do next:
                    </Text>
                  </View>
                </View>
              </>
            )}
          </SpotlightTourProvider>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles=StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
  title: {
    textAlign: "center",
    marginVertical: 8,

  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    backgroundColor: Colors.red,
  },
});

export default App;
