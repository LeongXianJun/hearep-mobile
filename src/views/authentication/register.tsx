import React, { useState, FC } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  Text, Button, TextInput, RadioButton, TouchableRipple, HelperText
} from 'react-native-paper'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { UserStore } from '../../stores'
import { AppContainer } from '../common'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const RegisterPage: FC<PageProp> = ({ navigation }) => {
  const [ isDPVisible, setIsDPVisible ] = useState(false)
  const [ info, setInfo ] = useState({
    username: '',
    dob: new Date(),
    gender: 'M',
    email: '',
    occupation: ''
  })
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const [ errors, setErrors ] = useState({
    'username': '',
    'email': '',
    'occupation': ''
  })

  const updateInfo = (field: 'username' | 'gender' | 'email' | 'occupation', value: string) => {
    setInfo({ ...info, [ field ]: value })
    if (field !== 'gender') {
      setErrors({ ...errors, [ field ]: '' })
    }
  }

  const updateDob = (date: Date) => {
    setIsDPVisible(false)
    setInfo({ ...info, dob: date })
  }

  const register = () => {
    setIsSubmitting(true)
    UserStore.createUser({ ...info, gender: info.gender as 'M' | 'F' })
      .then(() => {
        UserStore.setRegister(false)
        navigation.reset({
          index: 0,
          routes: [ { name: 'Home' } ]
        })
      })
      .catch(err => {
        const errors: string[] = err.message.split('"user.')
        setErrors(
          errors.reduce<{
            'username': string
            'email': string
            'occupation': string
          }>((all, e) => {
            if (e.includes('username')) {
              return { ...all, 'username': e.replace('"', '') }
            } else if (e.includes('email')) {
              return { ...all, 'email': e.replace('"', '') }
            } else if (e.includes('occupation')) {
              return { ...all, 'occupation': e.replace('"', '') }
            } else
              return all
          }, {
            'username': '',
            'email': '',
            'occupation': ''
          })
        )
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <AppContainer isKeyboardAvoidingView hasNoBar>
      <View style={ { flex: 1 } }>
        <Text style={ styles.title }>{ 'Basic Information' }</Text>
        <Text style={ styles.subtitle }>{ 'Please fill in the following fields.' }</Text>
      </View>
      <View style={ { flex: 1, alignItems: 'center' } }>
        <TextInput
          label='Fullname'
          mode='outlined'
          value={ info.username }
          error={ errors[ 'username' ] !== '' }
          onChangeText={ text => updateInfo('username', text) }
          style={ styles.textInput }
        />
        { errors[ 'username' ] !== ''
          ? <HelperText type='error'>
            { errors[ 'username' ] }
          </HelperText>
          : null
        }
        <TouchableRipple onPress={ () => setIsDPVisible(true) } style={ styles.textInput }>
          <TextInput
            label='Date of Birth'
            mode='outlined'
            value={ info.dob.toDateString() }
            onTouchStart={ e => {
              e.preventDefault()
              setIsDPVisible(true)
            } }
            style={ { width: '100%' } }
          />
        </TouchableRipple>
        <View style={ [ styles.textInput, { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 3, borderColor: 'white', borderWidth: 1 } ] }>
          <View style={ { flex: 1, justifyContent: 'center' } }>
            <Text style={ { fontSize: 18, marginLeft: 3 } }>Gender</Text>
          </View>
          <View style={ { flex: 2, flexDirection: 'row', alignContent: 'center' } }>
            <RadioButton.Group value={ info.gender } onValueChange={ val => updateInfo('gender', val) }>
              <RadioButton.Item label='Male' value='M' />
              <RadioButton.Item label='Female' value='F' />
            </RadioButton.Group>
          </View>
        </View>
        <TextInput
          label='Email'
          mode='outlined'
          value={ info.email }
          error={ errors[ 'email' ] !== '' }
          onChangeText={ text => updateInfo('email', text) }
          style={ styles.textInput }
        />
        { errors[ 'email' ] !== ''
          ? <HelperText type='error'>
            { errors[ 'email' ] }
          </HelperText>
          : null
        }
        <TextInput
          label='Occupation'
          mode='outlined'
          value={ info.occupation }
          error={ errors[ 'occupation' ] !== '' }
          onChangeText={ text => updateInfo('occupation', text) }
          style={ styles.textInput }
        />
        { errors[ 'occupation' ] !== ''
          ? <HelperText type='error'>
            { errors[ 'occupation' ] }
          </HelperText>
          : null
        }
      </View>
      <View style={ [ styles.lastView, styles.buttons, { flex: 1, justifyContent: 'center', alignItems: 'center' } ] }>
        <Button mode='contained' loading={ isSubmitting } style={ styles.button } labelStyle={ { color: Colors.text } } onPress={ register }>{ 'Register' }</Button>
      </View>
      <DateTimePicker
        isVisible={ isDPVisible }
        date={ info.dob }
        onConfirm={ date => updateDob(date) }
        onCancel={ () => setIsDPVisible(false) }
      />
    </AppContainer>
  )
}

export default RegisterPage

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginTop: 25,
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