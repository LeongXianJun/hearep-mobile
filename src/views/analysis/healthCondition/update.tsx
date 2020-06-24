import React, { FC, useState, useEffect } from 'react'
import {
  StatusBar, KeyboardAvoidingView, ScrollView, View, StyleSheet,
  Dimensions, Platform, Picker
} from 'react-native'
import {
  TextInput, Text, Button, ActivityIndicator
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../../styles'
import { HealthConditionStore } from '../../../stores'

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
  const options = HealthConditionStore.getHealthConditionOptions()

  const [ isLoading, setIsLoading ] = useState(false)
  const [ field, setfield ] = useState('Blood Sugar Level')
  const [ val, setVal ] = useState(0)

  useEffect(() => {
    if (isLoading === false)
      HealthConditionStore.fetchOptions()
        .then(() => setIsLoading(true))
  }, [ isLoading ])

  const update = () =>
    HealthConditionStore.insertHealthCondition({ date: new Date(), option: field, value: val })
      .then(() =>
        navigation.goBack()
      )

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <KeyboardAvoidingView style={ styles.container } behavior={ Platform.OS == "ios" ? "padding" : "height" }>
        {
          isLoading
            ? <>
              <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
                <View style={ { flexDirection: 'row' } }>
                  <Text style={ { flex: 1, textAlignVertical: 'center' } }>{ 'Field' }</Text>
                  <View style={ { flex: 7, borderWidth: 1, borderColor: 'white', borderRadius: 3 } }>
                    <Picker
                      mode='dropdown'
                      selectedValue={ field }
                      style={ { width: '100%' } }
                      onValueChange={ itemValue => setfield(itemValue) }
                    >
                      {
                        options.map((option, index) => <Picker.Item key={ 'o-' + index } label={ option } value={ option } />)
                      }
                    </Picker>
                  </View>
                </View>
                <View>
                  <TextInput
                    label={ 'Value' }
                    keyboardType={ 'number-pad' }
                    mode='outlined'
                    value={ val.toFixed(0) }
                    onChangeText={ text => setVal(parseInt(text)) }
                    style={ styles.textInput }
                  />
                </View>
              </ScrollView>
              <View style={ [ styles.lastView, styles.buttons ] }>
                <Button mode='contained' disabled={ isLoading } style={ styles.button } onPress={ update }>{ 'Update' }</Button>
              </View>
            </>
            : <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
              <ActivityIndicator size='large' style={ styles.indicator } />
            </View>
        }
      </KeyboardAvoidingView>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(UpdateHealthConditionPage)

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
  indicator: {
    marginVertical: 50
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