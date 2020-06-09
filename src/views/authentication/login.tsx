import React, { FC, useState } from 'react'
import {
  StatusBar, Platform, KeyboardAvoidingView, View, StyleSheet,
  ScrollView, Dimensions
} from 'react-native'
import {
  Text, Button, TextInput, HelperText
} from 'react-native-paper'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { AuthUtil } from '../../utils'
import { Logo, Title, Slogan } from '../../resources/logo'

const barColor = Colors.primary

interface LoginPageProp {
  navigation: NavigationHelpers<ParamListBase>
}

const LoginPage: FC<LoginPageProp> = ({ navigation }) => {
  const [ phoneNumber, setPN ] = useState('')
  const [ err, setErr ] = useState('')

  const proceed = (register?: boolean) =>
    checkPN(phoneNumber)
      ?
      AuthUtil.signIn(phoneNumber)
        .then(() => setErr(''))
        .then(() =>
          navigation.navigate('OTP', {
            'isRegister': register === true ? 'true' : 'false'
          })
        )
        .catch(err => err)
      : setErr('Regex not match')

  const checkPN = (PN: string) => {
    const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[0-9]*$/
    return regex.test(PN)
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <KeyboardAvoidingView style={ styles.container } behavior={ Platform.OS == "ios" ? "padding" : "height" }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flex: 5, justifyContent: 'flex-end', alignItems: 'center' } }>
            <Logo width={ 150 } height={ 130 } />
            <Title width={ 250 } height={ 70 } />
            <Slogan width={ 200 } height={ 20 } />
          </View>
          <View style={ { flex: 4, alignItems: 'center' } }>
            <View style={ styles.textInput }>
              <TextInput
                label='Phone Number'
                mode='outlined'
                placeholder={ '+(60)123456789' }
                value={ phoneNumber }
                error={ err !== '' }
                onChangeText={ text => {
                  setErr('')
                  setPN(text)
                } }
              />
              <HelperText
                type='error'
                visible={ err !== '' }
              >
                { err }
              </HelperText>
            </View>
            <View style={ styles.buttons }>
              <Button mode='contained' style={ styles.button } onPress={ proceed }>{ 'Login' }</Button>
              <Button style={ styles.button } onPress={ () => proceed(true) }>{ 'Register' }</Button>
            </View>
          </View>
          <View style={ [ styles.lastView, { flex: 1, justifyContent: 'center', alignItems: 'center' } ] }>
            <Text>{ 'Apply to Terms and Conditions' }</Text>
            {/* nid to redirect to another new page which list all the terms and conditions */ }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </React.Fragment>
  )
}

export default LoginPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0),
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