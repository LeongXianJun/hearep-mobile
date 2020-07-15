import React, { FC, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button, TextInput, HelperText } from 'react-native-paper'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'

import { AuthUtil } from '../../utils'
import { UserStore } from '../../stores'
import { AppContainer } from '../common'
import { Logo, Title, Slogan } from '../../resources/logo'

interface LoginPageProp {
  navigation: NavigationHelpers<ParamListBase>
}

const LoginPage: FC<LoginPageProp> = ({ navigation }) => {
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ phoneNumber, setPN ] = useState('')
  const [ err, setErr ] = useState('')

  const login = () => {
    if (checkPN(phoneNumber)) {
      setIsSubmitting(true)
      UserStore.checkExistingUser(phoneNumber)
        .then(hasUser => {
          if (hasUser) {
            AuthUtil.signIn(phoneNumber)
              .then(() => {
                setIsSubmitting(false)
                setErr('')
              })
              .then(() =>
                navigation.navigate('OTP', {
                  'isRegister': 'false'
                })
              )
          } else {
            throw new Error('This phone number is not registered yet.')
          }
        })
        .catch(err => {
          setIsSubmitting(false)
          setErr(err.message)
        })
    } else {
      setErr('Format of the phone number is wrong.')
    }
  }

  const register = () => {
    if (checkPN(phoneNumber)) {
      setIsSubmitting(true)
      UserStore.checkExistingUser(phoneNumber)
        .then(hasUser => {
          if (!hasUser) {
            AuthUtil.signIn(phoneNumber)
              .then(() => {
                setIsSubmitting(false)
                setErr('')
              })
              .then(() =>
                navigation.navigate('OTP', {
                  'isRegister': 'true'
                })
              )
          } else {
            throw new Error('This phone number is used by another user.')
          }
        })
        .catch(err => {
          setIsSubmitting(false)
          setErr(err.message)
        })
    } else {
      setErr('Format of the phone number is wrong.')
    }
  }

  const checkPN = (PN: string) => {
    const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[0-9]{9,11}$/
    return regex.test(PN)
  }

  return (
    <AppContainer isKeyboardAvoidingView hasNoBar>
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
            keyboardType='phone-pad'
            placeholder={ err !== '' ? '' : '+60123456789' }
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
          <Button mode='contained' style={ styles.button } disabled={ isSubmitting } loading={ isSubmitting } onPress={ login }>{ 'Login' }</Button>
          <Button style={ styles.button } disabled={ isSubmitting } loading={ isSubmitting } onPress={ register }>{ 'Register' }</Button>
        </View>
      </View>
      <View style={ [ styles.lastView, { flex: 1, justifyContent: 'center', alignItems: 'center' } ] }>
        <Text>{ 'Apply to Terms and Conditions' }</Text>
        {/* nid to redirect to another new page which list all the terms and conditions */ }
      </View>
    </AppContainer>
  )
}

export default LoginPage

const styles = StyleSheet.create({
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