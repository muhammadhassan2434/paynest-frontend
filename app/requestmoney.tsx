import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Requestmoney = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Working....</Text>
    </View>
  )
}

export default Requestmoney

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