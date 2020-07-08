import React, { useState, FC, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import { Text, Button, TextInput, HelperText } from 'react-native-paper'

import { AuthUtil } from '../../utils'
import { UserStore } from '../../stores'
import { AppContainer } from '../common'

interface PageProp {
  route: any
  navigation: NavigationProp<ParamListBase>
}

const LoginPage: FC<PageProp> = ({ route, navigation }) => {
  const { isRegister } = route.params
  const [ snackVisible, setSnackVisible ] = useState(false)
  const [ code, setC ] = useState('')
  const [ err, setErr ] = useState('')

  useEffect(() => {
    UserStore.setRegister(isRegister)
  }, [ isRegister ])

  const proceed = () =>
    checkOTPFormet(code)
      ? AuthUtil.verifyCode(code)
        .then(() => {
          if (isRegister === 'true') {
            navigation.navigate('Register')
          } else {
            navigation.reset({
              index: 0,
              routes: [ { name: 'Home' } ]
            })
          }
        })
        .catch(err => setErr(err.message))
      : setErr('Format of the OTP code is wrong.')

  const checkOTPFormet = (otp: string) => /^\d{6}$/.test(otp)

  return (
    <AppContainer isKeyboardAvoidingView hasNoBar>
      <View style={ { flex: 2, justifyContent: 'flex-end' } }>
        <Text style={ styles.title }>{ 'OTP Code' }</Text>
        <Text style={ styles.subtitle }>{ 'Please enter the OTP code' }</Text>
      </View>
      <View style={ { flex: 3, alignItems: 'center' } }>
        <TextInput
          label='OTP Code'
          placeholder='Please enter the OTP code.'
          keyboardType='number-pad'
          mode='outlined'
          style={ styles.textInput }
          value={ code }
          error={ err !== '' }
          onChangeText={ text => {
            setErr('')
            setC(text)
          } }
        />
        <HelperText
          type='error'
          visible={ err !== '' }
        >
          { err }
        </HelperText>
        <View style={ [ styles.lastView, styles.buttons ] }>
          <Button mode='contained' style={ styles.button } onPress={ proceed }>{ isRegister === 'true' ? 'Continue' : 'Login' }</Button>
          <Button style={ { width: '60%' } } onPress={ () => setSnackVisible(true) } loading={ snackVisible } disabled={ snackVisible }>{ 'Request OTP' }</Button>
        </View>
      </View>
    </AppContainer>
  )
}

export default LoginPage

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 40
  },
  subtitle: {
    fontWeight: '300',
    marginVertical: 10,
    fontSize: 20
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
    width: '100%'
  }
})