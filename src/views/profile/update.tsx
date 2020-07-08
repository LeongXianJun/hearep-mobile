import React, { useState, FC, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  Text, RadioButton, TextInput, Button, Title, Subheading, TouchableRipple, HelperText
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { UserStore } from '../../stores'
import { AppContainer } from '../common'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const UpdateProfilePage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Update Profile',
    headerStyle: {
      backgroundColor: '#b3c100',
    },
    headerTintColor: '#ffffff'
  })

  const CurrentUser = UserStore.getUser()

  const [ isDPVisible, setIsDPVisible ] = useState(false)
  const [ info, setInfo ] = useState({
    username: '',
    dob: new Date(),
    gender: 'M' as 'M' | 'F',
    email: '',
    occupation: ''
  })
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const [ errors, setErrors ] = useState({
    'username': '',
    'email': '',
    'occupation': ''
  })

  const { username, dob, gender, email, occupation } = info

  const updateInfo = (field: 'username' | 'gender' | 'email' | 'occupation', value: string) => {
    setInfo({ ...info, [ field ]: value })
    if (field !== 'gender') {
      setErrors({ ...errors, [ field ]: '' })
    }
  }

  useEffect(() => {
    if (CurrentUser) {
      const { username, dob, gender, email, occupation } = CurrentUser
      setInfo({
        username, gender, email, dob,
        occupation: occupation ?? ''
      })
      setIsLoading(false)
    }
  }, [ CurrentUser ])

  useEffect(() => {
    if (isLoading && CurrentUser === undefined) {
      UserStore.fetchUser()
        .finally(() => setIsLoading(false))
    }
    return UserStore.unsubscribe
  }, [ isLoading, CurrentUser ])

  const updateDob = (date: Date) => {
    setIsDPVisible(false)
    setInfo({ ...info, dob: date })
  }

  const updateProfile = () => {
    if (CurrentUser) {
      setIsSubmitting(true)
      UserStore.updateProfile({ username, dob, gender, email, occupation })
        .then(() => {
          navigation.goBack()
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
  }

  return (
    <AppContainer isKeyboardAvoidingView isLoading={ isLoading }>
      <View style={ { flex: 1, marginTop: 25 } }>
        <Title>{ 'Basic Information' }</Title>
        <Subheading>{ 'Please fill in the following fields.' }</Subheading>
      </View>
      <View style={ { flex: 1, alignItems: 'center' } }>
        <TextInput
          label='Fullname'
          mode='outlined'
          value={ username }
          error={ errors[ 'username' ] !== '' }
          onChangeText={ text => setInfo({ ...info, username: text }) }
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
            value={ dob.toDateString() }
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
            <RadioButton.Group value={ gender } onValueChange={ val => updateInfo('gender', val) }>
              <RadioButton.Item label='Male' value="M" />
              <RadioButton.Item label='Female' value="F" />
            </RadioButton.Group>
          </View>
        </View>
        <TextInput
          label='Email'
          mode='outlined'
          value={ email }
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
          value={ occupation }
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
        <Button mode='contained' loading={ isSubmitting } style={ styles.button } onPress={ updateProfile }>{ 'Update Profile' }</Button>
      </View>
      <DateTimePicker
        isVisible={ isDPVisible }
        date={ dob }
        onConfirm={ date => updateDob(date) }
        onCancel={ () => setIsDPVisible(false) }
      />
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(UpdateProfilePage)

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
    width: '100%'
  }
})