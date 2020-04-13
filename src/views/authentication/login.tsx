import React from 'react'
import {
  StatusBar, Platform, KeyboardAvoidingView, View, StyleSheet, 
  ScrollView, Dimensions
} from 'react-native'
import {
  Text, Button, TextInput
} from 'react-native-paper'
import { Colors } from '../../styles'

import Logo from '../../resources/logo/icon.svg'
import Title from '../../resources/logo/title.svg'
import Slogan from '../../resources/logo/slogan.svg'

const barColor = Colors.primary

export default function LoginPage({navigation}) {
  const proceed = (register?: boolean) => {
    navigation.navigate('OTP', {
      'isRegister': register === true? 'true': 'false'
    })
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={barColor}/>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 5, justifyContent: 'flex-end', alignItems: 'center'}}>
            <Logo width={150} height={130}/>
            <Title width={250} height={70}/>
            <Slogan width={200} height={20}/>
          </View>
          <View style={{flex: 4, alignItems: 'center'}}>
            <TextInput
              label='Phone Number'
              mode='outlined'
              style={styles.textInput}
            />
            <View style={styles.buttons}>
              <Button mode='contained' style={styles.button} onPress={proceed}>{'Login'}</Button>
              <Button style={styles.button} onPress={() => proceed(true)}>{'Register'}</Button>
            </View>
          </View>
          <View style={[styles.lastView, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
            <Text>{'Apply to Terms and Conditions'}</Text>
          </View>
        </ScrollView>
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
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight,
    marginHorizontal: '10%'
  },
  buttons: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    marginVertical: 5,
    width: '60%',
    height: '15%',
    minHeight: 40
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  },
  textInput: {
    marginVertical: 10,
    width: '80%'
  }
})