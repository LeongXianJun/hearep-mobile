import React from 'react'
import {
  StatusBar, Platform, KeyboardAvoidingView, View, StyleSheet, 
} from 'react-native'
import {
  Text
} from 'react-native-paper'
import { Colors } from '../../styles'

export default function HomePage({navigation}) {

  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <View style={styles.content}>
          <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{'Home'}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.background 
  },
  content: {
    flex: 1,
    marginHorizontal: '10%'
  },
  button: {
    marginVertical: 10,
    width: '60%',
    height: '15%'
  },
  textInput: {
    marginVertical: 10,
    width: '80%'
  }
})