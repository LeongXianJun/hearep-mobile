import React, { useState, FC } from 'react'
import {
  StatusBar, Platform, KeyboardAvoidingView, View, StyleSheet, ScrollView, Dimensions
} from 'react-native'
import {
  Text, Button, TextInput, RadioButton, TouchableRipple
} from 'react-native-paper'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { UserStore } from '../../stores'

const barColor = Colors.primary

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const RegisterPage: FC<PageProp> = ({ navigation }) => {
  const [ isDPVisible, setIsDPVisible ] = useState(false)
  const [ fullname, setFullname ] = useState('')
  const [ dob, setDob ] = useState(new Date())
  const [ gender, setGender ] = useState<'M' | 'F'>('M')
  const [ email, setEmail ] = useState('')
  const [ occupation, setOccupation ] = useState('')
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const updateDob = (date: Date) => {
    setIsDPVisible(false)
    setDob(date)
  }

  const register = () => {
    setIsSubmitting(true)
    UserStore.createUser({ username: fullname, dob, gender, email, occupation })
      .then(() => {
        UserStore.setRegister(false)
        navigation.reset({
          index: 0,
          routes: [ { name: 'Home' } ]
        })
      })
      .catch(err => {
        setIsSubmitting(false)
        throw new Error(err)
      })
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <KeyboardAvoidingView style={ styles.container } behavior={ Platform.OS == "ios" ? "padding" : "height" }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flex: 1 } }>
            <Text style={ styles.title }>{ 'Basic Information' }</Text>
            <Text style={ styles.subtitle }>{ 'Please fill in the following fields.' }</Text>
          </View>
          <View style={ { flex: 1, alignItems: 'center' } }>
            <TextInput
              label='Fullname'
              mode='outlined'
              value={ fullname }
              onChangeText={ text => setFullname(text) }
              style={ styles.textInput }
            />
            <TouchableRipple onPress={ () => setIsDPVisible(true) } style={ styles.textInput }>
              <TextInput
                label='Date of Birth'
                mode='outlined'
                value={ dob.toDateString() }
                disabled
                style={ { width: '100%' } }
              />
            </TouchableRipple>
            <View style={ [ styles.textInput, { flex: 1, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 3, borderColor: 'white', borderWidth: 1 } ] }>
              <View style={ { flex: 1, justifyContent: 'center' } }>
                <Text style={ { fontSize: 18, marginLeft: 3 } }>Gender</Text>
              </View>
              <View style={ { flex: 2, flexDirection: 'row', alignContent: 'center' } }>
                <RadioButton.Group value={ gender } onValueChange={ val => setGender(val as typeof gender) }>
                  <RadioButton.Item label='Male' value='M' />
                  <RadioButton.Item label='Female' value='F' />
                </RadioButton.Group>
              </View>
            </View>
            <TextInput
              label='Email'
              mode='outlined'
              value={ email }
              onChangeText={ text => setEmail(text) }
              style={ styles.textInput }
            />
            <TextInput
              label='Occupation'
              mode='outlined'
              value={ occupation }
              onChangeText={ text => setOccupation(text) }
              style={ styles.textInput }
            />
          </View>
          <View style={ [ styles.lastView, styles.buttons, { flex: 1, justifyContent: 'center', alignItems: 'center' } ] }>
            <Button mode='contained' loading={ isSubmitting } style={ styles.button } labelStyle={ { color: Colors.text } } onPress={ register }>{ 'Register' }</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <DateTimePicker
        isVisible={ isDPVisible }
        date={ dob }
        onConfirm={ date => updateDob(date) }
        onCancel={ () => setIsDPVisible(false) }
      />
    </React.Fragment>
  )
}

export default RegisterPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0),
    paddingHorizontal: '10%'
  },
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