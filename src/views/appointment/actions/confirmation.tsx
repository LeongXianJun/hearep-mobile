import React, { FC, useLayoutEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { withResubAutoSubscriptions } from 'resub'
import { Text, Card, Button } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '../../../styles'
import { DateUtil } from '../../../utils'
import { AppContainer } from '../../common'
import { AppointmentStore, UserStore } from '../../../stores'

const barColor = '#e982f6'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const AppointmentConfirmationPage: FC<PageProp> = ({ navigation }) => {
  const medicalStaff = UserStore.getMedicalStaff()
  const selectedApp = AppointmentStore.getSelectedAppointment() // if got selected, mean it is a rescheduling
  const newAppDetail = AppointmentStore.getNewAppDetail()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Confirmation' + (selectedApp !== undefined ? ' on Reschedule' : ''),
      headerStyle: {
        backgroundColor: barColor,
      },
      headerTintColor: '#ffffff'
    })
  }, [ navigation ])

  const createNewAppointment = () =>
    Promise.resolve(
      selectedApp
        ? AppointmentStore.rescheduleAppointment(selectedApp.id)
        : AppointmentStore.insertAppointment()
    )
      .then(() =>
        navigation.reset({
          index: 0,
          routes: [ { name: 'Home' }, { name: 'Appointment' } ]
        })
      )
      .catch(err => console.log(err))

  return (
    <AppContainer>
      <View style={ { flex: 7, marginTop: 70, marginBottom: 10 } }>
        <Card>
          <Card.Title title={ (selectedApp ? ' New ' : '') + 'Appointment Detail' } style={ styles.cardStart } />
          <Card.Content>
            {
              [
                { field: 'Medical Staff', val: medicalStaff.find(ms => ms.id === (selectedApp ?? newAppDetail)?.medicalStaffId)?.username },
                { field: 'Address', val: (selectedApp ?? newAppDetail)?.address },
                { field: (selectedApp?.type === 'byTime' ? selectedApp.time.toDateString() : undefined) ?? 'Date', val: newAppDetail?.time?.toDateString(), isChange: selectedApp !== undefined },
                { field: (selectedApp?.type === 'byTime' ? DateUtil.hour12(selectedApp.time) : undefined) ?? 'Time', val: newAppDetail?.time && DateUtil.hour12(newAppDetail.time), isNormalText: true, isChange: selectedApp !== undefined },
                { field: 'Turn', val: newAppDetail?.turn, isNormalText: true }
              ].filter(({ val }) => val !== undefined && val !== '').map(({ field, val, isNormalText, isChange }, index) =>
                <View key={ 'bi-' + index } style={ { flexDirection: 'row', marginVertical: 10 } }>
                  <View style={ { flex: isChange && selectedApp ? 3 : 2 } }>
                    <Text style={ styles.text }>{ field }</Text>
                  </View>
                  {
                    isChange
                      ? <View style={ { flex: 1 } }>
                        <MaterialCommunityIcons name='chevron-right' color='black' size={ 20 } />
                      </View>
                      : null
                  }
                  <View style={ { flex: 3 } }>
                    <Text style={ [ styles.text, isNormalText ? {} : { textTransform: 'capitalize' } ] }>{ val }</Text>
                  </View>
                </View>
              )
            }
          </Card.Content>
          <Card.Actions style={ styles.cardEnd }>
          </Card.Actions>
        </Card>
      </View>
      <View style={ [ styles.lastView, styles.buttons, { flex: 1, justifyContent: 'center', alignItems: 'center' } ] }>
        <Button mode='contained' style={ [ styles.button, { backgroundColor: barColor } ] } labelStyle={ { color: Colors.text } } onPress={ createNewAppointment }>{ 'Confirm' }</Button>
      </View>
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(AppointmentConfirmationPage)

const styles = StyleSheet.create({
  cardStart: {
    backgroundColor: barColor,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  cardEnd: {
    backgroundColor: barColor,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  title: {
    fontWeight: 'bold',
    marginTop: 25,
    fontSize: 35
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
  text: {
    color: 'black',
    fontSize: 16
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  }
})