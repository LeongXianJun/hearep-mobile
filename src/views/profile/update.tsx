import React, { useState, FC, useEffect } from 'react'
import {
  StatusBar, ScrollView, View, StyleSheet, Dimensions,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import {
  Text, RadioButton, TextInput, Button, Title, Subheading
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { UserStore } from '../../stores'
import { isUndefined } from '../../utils'

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

  const [ info, setInfo ] = useState({
    username: '',
    dob: '',
    gender: 'M' as 'M' | 'F',
    email: '',
    occupation: ''
  })

  const { username, dob, gender, email, occupation } = info

  useEffect(() => {
    if (isUndefined(CurrentUser)) {
      UserStore.fetchUser()
    } else {
      const { username, dob, gender, email, occupation } = CurrentUser
      setInfo({
        username, gender, email,
        dob: dob.toDateString(),
        occupation: occupation ?? ''
      })
    }

    return UserStore.unsubscribe
  }, [ CurrentUser ])

  const updateProfile = () => {
    if (CurrentUser) {
      UserStore.updateProfile({ username, dob: dob, gender, email, occupation })
        .then(() => {
          navigation.goBack()
        })
    }
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor='#b3c100' />
      <KeyboardAvoidingView style={ styles.container } behavior={ Platform.OS == "ios" ? "padding" : "height" }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flex: 1, marginTop: 25 } }>
            <Title>{ 'Basic Information' }</Title>
            <Subheading>{ 'Please fill in the following fields.' }</Subheading>
          </View>
          <View style={ { flex: 1, alignItems: 'center' } }>
            <TextInput
              label='Fullname'
              mode='outlined'
              value={ username }
              onChangeText={ text => setInfo({ ...info, username: text }) }
              style={ styles.textInput }
            />
            <TextInput
              label='Date of Birth'
              mode='outlined'
              value={ dob }
              placeholder='YYYY-MM-DD'
              onChangeText={ text => setInfo({ ...info, dob: text }) }
              style={ styles.textInput }
            />
            <View style={ [ styles.textInput, { flex: 1, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 3, borderColor: 'white', borderWidth: 1 } ] }>
              <View style={ { flex: 1, justifyContent: 'center' } }>
                <Text style={ { fontSize: 18, marginLeft: 3 } }>Gender</Text>
              </View>
              <View style={ { flex: 2, flexDirection: 'row', alignContent: 'center' } }>
                <RadioButton.Group value={ gender } onValueChange={ val => setInfo({ ...info, gender: val as typeof info[ 'gender' ] }) }>
                  <RadioButton.Item label='Male' value="M" />
                  <RadioButton.Item label='Female' value="F" />
                </RadioButton.Group>
              </View>
            </View>
            <TextInput
              label='Email'
              mode='outlined'
              value={ email }
              onChangeText={ text => setInfo({ ...info, email: text }) }
              style={ styles.textInput }
            />
            <TextInput
              label='Occupation'
              mode='outlined'
              value={ occupation }
              onChangeText={ text => setInfo({ ...info, occupation: text }) }
              style={ styles.textInput }
            />
          </View>
          <View style={ [ styles.lastView, styles.buttons, { flex: 1, justifyContent: 'center', alignItems: 'center' } ] }>
            <Button mode='contained' style={ styles.button } onPress={ updateProfile }>{ 'Update Profile' }</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(UpdateProfilePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
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
    width: '100%'
  }
})