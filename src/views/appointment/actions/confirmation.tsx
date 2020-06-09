import React, { FC } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Text, Card, Button
} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '../../../styles'
import { AppointmentC } from '../../../connections'
import { NavigationProp, ParamListBase, Route } from '@react-navigation/native'

const barColor = '#e982f6'

interface PageProp {
  route: any
  navigation: NavigationProp<ParamListBase>
}

const AppointmentConfirmationPage: FC<PageProp> = ({ route, navigation }) => {
  const rescheduleId = route.params?.rescheduleId
  const oldAppointment = AppointmentC.getAppointment(rescheduleId)
  navigation.setOptions({
    title: 'Confirmation' + (oldAppointment ? ' on Reschedule' : ''),
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const detail = AppointmentC.newAppointment
  const createNewAppointment = () => {
    AppointmentC.createNewAppointment()
    navigation.reset({
      index: 0,
      routes: [ { name: 'Home' }, { name: 'Appointment' } ]
    })
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flex: 7, marginTop: 70, marginBottom: 10 } }>
            <Card>
              <Card.Title title={ (oldAppointment ? ' New ' : '') + 'Appointment Detail' } style={ styles.cardStart } />
              <Card.Content>
                {
                  [
                    { field: 'Medical Staff', val: (oldAppointment ?? detail)?.medicalStaff },
                    { field: 'Address', val: (oldAppointment ?? detail)?.address },
                    { field: oldAppointment?.date.toDateString() ?? 'Date', val: detail.date?.toDateString(), isChange: oldAppointment !== undefined },
                    { field: (oldAppointment?.type === 'byTime' && oldAppointment.time) ?? 'Time', val: detail.time, isNormalText: true, isChange: oldAppointment !== undefined },
                    { field: 'Turn', val: detail.turn, isNormalText: true }
                  ].filter(({ val }) => val !== undefined && val !== '').map(({ field, val, isNormalText, isChange }, index) =>
                    <View key={ 'bi-' + index } style={ { flexDirection: 'row', marginVertical: 10 } }>
                      <View style={ { flex: isChange && oldAppointment ? 3 : 2 } }>
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
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}

export default AppointmentConfirmationPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
    marginHorizontal: '10%'
  },
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