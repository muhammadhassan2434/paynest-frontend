import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Mycard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Working....</Text>
    </View>
  )
}

export default Mycard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
  },
})