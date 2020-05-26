import React, { useState, FC } from 'react'
import {
  StatusBar, KeyboardAvoidingView, ScrollView, View, StyleSheet,
  Dimensions, Platform, Picker
} from 'react-native'
import {
  TextInput, Text, Button
} from 'react-native-paper'
import { Colors } from '../../../styles'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

const barColor = '#34675c'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const UpdateHealthConditionPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Update Health Condition',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const options = [
    'Blood Sugar Level', 'Blood Pressure', 'BMI'
  ]
  const [ field, setfield ] = useState<'Blood Sugar Level' | 'Blood Pressure' | 'BMI'>('Blood Sugar Level')
  const [ val, setVal ] = useState({
    'Blood Sugar Level': '', 'Blood Pressure': '', 'BMI': ''
  })
  const onChange = (field: string) => (value: string) => {
    setVal({ ...val, [ field ]: value })
  }

  const update = () => {
    navigation.goBack()
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <KeyboardAvoidingView style={ styles.container } behavior={ Platform.OS == "ios" ? "padding" : "height" }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flexDirection: 'row' } }>
            <Text style={ { flex: 1, textAlignVertical: 'center' } }>{ 'Field' }</Text>
            <View style={ { flex: 7, borderWidth: 1, borderColor: 'white', borderRadius: 3 } }>
              <Picker
                mode='dropdown'
                selectedValue={ field }
                style={ { width: '100%' } }
                onValueChange={ (itemValue, itemIndex) => setfield(itemValue) }
              >
                {
                  options.map((option, index) => <Picker.Item key={ 'o-' + index } label={ option } value={ option } />)
                }
              </Picker>
            </View>
          </View>
          <View>
            <TextInput
              label={ 'Amount' }
              mode='outlined'
              value={ val[ field ] ?? '' }
              onChangeText={ text => onChange(field)(text) }
              style={ styles.textInput }
            />
          </View>
        </ScrollView>
        <View style={ [ styles.lastView, styles.buttons ] }>
          <Button mode='contained' style={ styles.button } onPress={ update }>{ 'Register' }</Button>
        </View>
      </KeyboardAvoidingView>
    </React.Fragment>
  )
}

export default UpdateHealthConditionPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
    paddingTop: 25,
    paddingBottom: 100,
    marginHorizontal: '10%'
  },
  textInput: {
    marginVertical: 10,
    width: '80%'
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(64, 70, 84, 0.6)',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    marginVertical: 5,
    width: '60%',
    minHeight: 40
  },
  lastView: {
    paddingTop: 10,
    paddingBottom: 25,
  },
})