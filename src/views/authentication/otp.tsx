import React, { useState } from 'react'
import {
  StatusBar, Platform, KeyboardAvoidingView, View, StyleSheet, Dimensions, 
} from 'react-native'
import {
  Text, Button, TextInput, Snackbar
} from 'react-native-paper'

import { UserC } from '../../connections'
import { Colors } from '../../styles'
import { ScrollView } from 'react-native-gesture-handler'

const barColor = Colors.primary

export default function LoginPage({ route, navigation }) {
  const [ snackVisible, setSnackVisible ] = useState(false)
  const { isRegister } = route.params
  const proceed = () => {
    if(isRegister === 'true') {
      navigation.navigate('Register')
    } else {
      UserC.login()
      navigation.navigate('Home')
    }
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={barColor}/>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 2, justifyContent: 'flex-end'}}>
            <Text style={styles.title}>{'OTP Code'}</Text>
            <Text style={styles.subtitle}>{'Please enter the OTP code'}</Text>
          </View>
          <View style={{flex: 3, alignItems: 'center'}}>
            <TextInput
              label='OTP Code'
              placeholder='Please enter the OTP code.'
              mode='outlined'
              style={styles.textInput}
            />
            <View style={[styles.lastView, styles.buttons]}>
              <Button mode='contained' style={styles.button} onPress={proceed}>{isRegister === 'true'? 'Continue': 'Login'}</Button>
              <Button style={{width: '60%'}} onPress={() => setSnackVisible(true)} loading={snackVisible} disabled={snackVisible}>{'Request OTP'}</Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar
        visible={snackVisible}
        duration={Snackbar.DURATION_MEDIUM}
        onDismiss={() => setSnackVisible(false)}
      >
        {'OTP code is resent.'}
      </Snackbar>
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
    marginTop: '10%',
    marginHorizontal: '10%'
  },
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