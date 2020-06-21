import React, { FC, useState, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Text, Card, Searchbar
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { UserStore, AppointmentStore, Appointment, MedicalStaff } from '../../stores'

const barColor = '#e982f6'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const HistoryPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Appointment History',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const medicalStaff = UserStore.getMedicalStaff()
  const appointments = AppointmentStore.getGroupedAppointments()
  const { Completed, Cancelled } = appointments

  const [ filter, setFilter ] = useState('')
  const [ oldAppointments, setOldAppointments ] = useState<(Appointment & { medicalStaff: MedicalStaff | undefined })[]>([])

  useEffect(() => {
    if (medicalStaff.length === 0)
      UserStore.fetchAllMedicalStaff()
  }, [ medicalStaff ])

  useEffect(() => {
    setOldAppointments([ ...Completed, ...Cancelled ].map(app => ({ ...app, medicalStaff: medicalStaff.find(ms => ms.id === app.medicalStaffId) })))
  }, [ Completed, Cancelled ])

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <Card style={ [ styles.lastView, styles.firstView ] }>
            <Card.Title title={ 'History' } style={ styles.cardStart } />
            <Card.Content>
              <Searchbar
                placeholder={ 'Enter Doctor\'s Name' }
                placeholderTextColor={ barColor }
                iconColor={ barColor }
                onChangeText={ val => setFilter(val) }
                style={ { elevation: 0, borderRadius: 0, borderBottomWidth: 1, borderColor: barColor } }
                inputStyle={ { color: barColor } }
                value={ filter }
              />
              {
                oldAppointments.filter(u => u.medicalStaff?.username.toLowerCase().includes(filter.toLowerCase()))
                  .map((app, index) =>
                    <View key={ 'bi-' + index } style={ { borderTopWidth: 1, borderTopColor: barColor, paddingVertical: 10 } }>
                      <View style={ { flexDirection: 'row', marginVertical: 5 } }>
                        <View style={ { flex: 1 } }>
                          <Text style={ styles.text }>{ (app.type === 'byTime' ? app.time : app.date).toDateString() }</Text>
                        </View>
                        <View style={ { flex: 1 } }>
                          <Text style={ [ styles.text, { textTransform: 'capitalize' } ] }>{ app.medicalStaff?.username }</Text>
                        </View>
                      </View>
                      <View style={ { marginBottom: 5 } }>
                        <Text style={ [ styles.text, { textTransform: 'capitalize' } ] }>{ `Address: ${app.address}` }</Text>
                      </View>
                    </View>
                  )
              }
            </Card.Content>
            <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}
export default withResubAutoSubscriptions(HistoryPage)

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
  text: {
    color: 'black',
    fontSize: 16
  },
  firstView: {
    marginTop: 25
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  }
})