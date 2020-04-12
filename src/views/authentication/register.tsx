import React, { useState } from 'react'
import {
  StatusBar, Platform, KeyboardAvoidingView, View, StyleSheet, ScrollView, Dimensions
} from 'react-native'
import {
  Text, Button, TextInput
} from 'react-native-paper'
import { Colors } from '../../styles'

export default function RegisterPage({navigation}) {
  const [ fullname, setFullname ] = useState('')
  const [ dob, setDob ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ altEmail, setAltEmail ] = useState('')
  const [ occupation, setOccupation ] = useState('')

  const register = () => {
    navigation.navigate('Home')
  }
  
  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{'Basic Information'}</Text>
            <Text style={styles.subtitle}>{'Please fill in the following fields.'}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TextInput
              label='Fullname'
              mode='outlined'
              value={fullname}
              onChangeText={text => setFullname(text)}
              style={styles.textInput}
            />
            <TextInput
              label='Date of Birth'
              mode='outlined'
              value={dob}
              placeholder='YYYY-MM-DD'
              onChangeText={text => setDob(text)}
              style={styles.textInput}
            />
            {/* put gender and radio */}
            <TextInput
              label='Email'
              mode='outlined'
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.textInput}
            />
            <TextInput
              label='Alternative Email'
              mode='outlined'
              value={altEmail}
              onChangeText={text => setAltEmail(text)}
              style={styles.textInput}
            />
            <TextInput
              label='Occupation'
              mode='outlined'
              value={occupation}
              onChangeText={text => setOccupation(text)}
              style={styles.textInput}
            />
          </View>
          <View style={[styles.lastView, styles.buttons, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
            <Button mode='contained' style={styles.button} onPress={register}>{'Register'}</Button>
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