import React, { FC, useEffect, useState } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native'
import {
  Text, ActivityIndicator
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { DateUtil } from '../../../utils'
import { Colors } from '../../../styles'
import { AppointmentStore } from '../../../stores'

const barColor = '#e982f6'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const GetNumberPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Get a Number',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const turnDetail = AppointmentStore.getByNumberDetail()
  const newAppDetail = AppointmentStore.getNewAppDetail()
  const width = Dimensions.get('window').width * 0.5

  const [ isReady, setIsReady ] = useState(false)
  const [ isOffDay, setIsOffDay ] = useState(false)

  useEffect(() => {
    if (isReady === false && newAppDetail?.medicalStaffId)
      AppointmentStore.getTurn(newAppDetail.medicalStaffId)
        .then(() => setIsReady(true))
        .catch(err => {
          if (err.message.includes('This medical staff does not operate')) {
            setIsReady(true)
            setIsOffDay(true)
          } else {
            Promise.reject(err)
          }
        })
  }, [ isReady, newAppDetail ])

  const process = () =>
    turnDetail?.turn !== undefined
      ? Promise.resolve(
        AppointmentStore.setNewAppDetail({ turn: turnDetail.turn })
      ).then(() => navigation.navigate('Appointment/Confirmation'))
      : undefined

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          {
            isReady
              ? isOffDay
                ? <Text style={ styles.instruction }>{ 'This doctor does not operate today. Please kindly choose another doctor.' }</Text>
                : <>
                  <Text style={ { textAlign: 'center' } }>{ DateUtil.hour12(turnDetail?.startTime) + ' - ' + DateUtil.hour12(turnDetail?.endTime) }</Text>
                  <Text style={ styles.instruction }>{ 'Click this to get this number and queue up' }</Text>
                  <TouchableOpacity style={ [ styles.circle, { width: width, height: width, borderRadius: width / 2 } ] } onPress={ process } activeOpacity={ 0.75 }>
                    <Text style={ styles.num }>{ turnDetail?.turn ?? 0 + 1 }</Text>
                  </TouchableOpacity>
                </>
              : <ActivityIndicator size='large' style={ styles.indicator } />
          }
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(GetNumberPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
    marginHorizontal: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicator: {
    marginVertical: 50
  },
  instruction: {
    fontSize: 26,
    textAlign: 'center',
    marginHorizontal: '5%'
  },
  circle: {
    marginVertical: 20,
    backgroundColor: barColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  num: {
    fontWeight: 'bold',
    fontSize: 100
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  }
})