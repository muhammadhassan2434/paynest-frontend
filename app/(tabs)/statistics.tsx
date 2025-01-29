import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Statistics = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Working on it</Text>
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centers the text horizontally
  },
  text: {
    fontSize: 30,
    textAlign: 'center', // Aligns the text inside the Text component
  },
});
