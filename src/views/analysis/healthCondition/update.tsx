import React, { FC, useState, useEffect } from 'react'
import { View, StyleSheet, Picker } from 'react-native'
import { withResubAutoSubscriptions } from 'resub'
import { TextInput, Text, Button } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../../styles'
import { AppContainer } from '../../common'
import { HealthAnalysisStore } from '../../../stores'

const barColor = Colors.primaryVariant

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
  const options = HealthAnalysisStore.getHealthConditionOptions()

  const [ isLoading, setIsLoading ] = useState(true)
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ field, setfield ] = useState('Blood Sugar Level')
  const [ val, setVal ] = useState(0)

  const onLoad = () => {
    HealthAnalysisStore.fetchOptions()
      .finally(() => setIsLoading(false))
  }

  useEffect(onLoad, [])

  const update = () => {
    setIsSubmitting(true)
    HealthAnalysisStore.insertHealthCondition({ date: new Date(), option: field, value: val })
      .then(() => {
        setIsSubmitting(false)
        navigation.goBack()
      })
      .catch(err => {
        setIsSubmitting(false)
        console.log(err)
      })
  }

  const actionButton = () =>
    <View style={ [ styles.lastView, styles.buttons ] }>
      <Button mode='contained' disabled={ isLoading || isSubmitting } loading={ isSubmitting } style={ styles.button } onPress={ update }>{ 'Update' }</Button>
    </View>

  return (
    <AppContainer isLoading={ isLoading } ATB={ actionButton() } ContentStyle={ { paddingTop: 25, paddingBottom: 100 } } onRefresh={ onLoad }>
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
              options.map((option, index) => <Picker.Item key={ 'o-' + index } color={ option === field ? Colors.primary : barColor } label={ option } value={ option } />)
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
          onChangeText={ text => setVal(parseInt(text !== '' ? text : '0')) }
          style={ [ styles.textInput, { width: '100%' } ] }
        />
      </View>
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(UpdateHealthConditionPage)

const styles = StyleSheet.create({
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