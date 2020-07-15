import React, { FC, useEffect, useState } from 'react'
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { DateUtil } from '../../../utils'
import { AppContainer } from '../../common'
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

  const [ isOffDay, setIsOffDay ] = useState(false)
  const [ hasWorkingTime, setHasWorkingTime ] = useState(true)
  const [ isLoading, setIsLoading ] = useState(true)

  const onLoad = () => {
    if (newAppDetail?.medicalStaffId)
      AppointmentStore.getTurn(newAppDetail.medicalStaffId)
        .then(() => setIsLoading(false))
        .catch(err => {
          if (err.message.includes('This medical staff does not operate')) {
            setIsOffDay(true)
          } else if (err.message.includes('Working Time is not set')) {
            setHasWorkingTime(false)
          } else {
            console.log(err)
          }
          setIsLoading(false)
        })
  }

  useEffect(() => {
    if (isLoading && newAppDetail?.medicalStaffId)
      onLoad()
  }, [ isLoading, newAppDetail ])

  const process = () =>
    turnDetail?.turn !== undefined
      ? Promise.resolve(
        AppointmentStore.setNewAppDetail({ turn: turnDetail.turn })
      ).then(() => navigation.navigate('Appointment/Confirmation'))
      : undefined

  return (
    <AppContainer isLoading={ isLoading } ContentStyle={ { justifyContent: 'center', alignItems: 'center' } } onRefresh={ onLoad }>
      {
        hasWorkingTime
          ? isOffDay
            ? <Text style={ styles.instruction }>{ 'This doctor does not operate today. Please kindly choose another doctor.' }</Text>
            : <>
              <Text style={ { textAlign: 'center' } }>{ DateUtil.hour12(turnDetail?.startTime) + ' - ' + DateUtil.hour12(turnDetail?.endTime) }</Text>
              <Text style={ styles.instruction }>{ 'Click this to get this number and queue up' }</Text>
              <TouchableOpacity style={ [ styles.circle, { width: width, height: width, borderRadius: width / 2 } ] } onPress={ process } activeOpacity={ 0.75 }>
                <Text style={ styles.num }>{ (turnDetail?.turn ?? 0) + 1 }</Text>
              </TouchableOpacity>
            </>
          :
          <Text style={ styles.instruction }>{ 'This medical staff has not set his/her working time. Please kindly schedule again after the medical staff set the working time.' }</Text>
      }
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(GetNumberPage)

const styles = StyleSheet.create({
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