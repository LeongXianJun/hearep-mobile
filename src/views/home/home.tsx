import React, { useState, FC, ReactText, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  Text, List, DefaultTheme, Card
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '../../styles'
import { AppContainer } from '../common'
import { UserStore, HealthRecordStore, MedicationRecord, AppointmentStore } from '../../stores'

const barColor = Colors.primaryVariant

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const HomePage: FC<PageProp> = ({ navigation }) => {
  const isReady = UserStore.ready()
  const CurrentUser = UserStore.getUser()
  const records = HealthRecordStore.getHealthRecords()
  const appointments = AppointmentStore.getGroupedAppointments()
  const nearingAppointments = [ ...appointments[ 'Waiting' ], ...appointments[ 'Accepted' ] ]
  const medications = records.healthPrescriptions.reduce<MedicationRecord[]>((all, hp) => [ ...all, ...hp.medicationRecords ], [])

  const [ isLoading, setIsLoading ] = useState(true)

  const [ expandId, setExpandId ] = useState(1)

  const onLoad = () => {
    Promise.all([
      HealthRecordStore.fetchPatientRecords(),
      AppointmentStore.fetchAllAppointments()
    ]).catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (isReady) {
      onLoad()
    }
    return UserStore.unsubscribeOnAuthStateChanged
  }, [ isReady ])

  return (
    <AppContainer isLoading={ isLoading } onRefresh={ onLoad }>
      <Text style={ styles.title }>{ CurrentUser?.username ? 'Welcome,\n' + CurrentUser.username : 'Welcome' }</Text>
      <Text style={ styles.subtitle }>{ 'Enhancing Life. Excelling in Care.' }</Text>
      <Card style={ { marginTop: 10 } } onPress={ () => navigation.navigate('Appointment') }>
        <Card.Cover source={ require('../../resources/images/appointment.jpg') } />
        <Card.Content style={ styles.cardEnd }>
          <View style={ { flex: 1, marginTop: 10, flexDirection: 'row', justifyContent: 'center' } }>
            <View style={ { flex: 1, justifyContent: 'center' } }>
              <Text style={ { fontSize: 16 } }>{ 'Make an Appointment Now' }</Text>
            </View>
            <MaterialCommunityIcons name='chevron-right' color={ Colors.text } size={ 24 } />
          </View>
        </Card.Content>
      </Card>
      {
        nearingAppointments.length > 0 || medications.length > 0
          ? <View style={ styles.lastView }>
            <List.Section title={ 'Notification' } titleStyle={ { fontSize: 25, color: Colors.text } }>
              <List.AccordionGroup
                expandedId={ expandId }
                onAccordionPress={ (expandedId: ReactText) => setExpandId(Number.parseInt(expandedId.toString())) }
              >
                { AppointmentNotification() }
                { MedicationNotification() }
              </List.AccordionGroup>
            </List.Section>
          </View>
          : <></>
      }
    </AppContainer>
  )

  function AppointmentNotification() {
    return (
      nearingAppointments.length > 0
        ? <List.Accordion id={ 1 } title='Appointments'
          titleStyle={ { color: Colors.text, fontWeight: 'bold' } }
          theme={ DefaultTheme }
          style={ styles.listStart }
        >
          {
            nearingAppointments.map((app, index) =>
              <List.Item key={ 'PU-' + index }
                style={ { backgroundColor: Colors.surface, marginBottom: 1 } }
                title={ 'Appointment on ' + (app.type === 'byTime' ? app.time : app.date).toDateString() }
                titleStyle={ [ styles.text, { textTransform: 'capitalize' } ] }
                description={ app.address + '\n' }
                descriptionStyle={ [ styles.text ] }
              />
            )
          }
        </List.Accordion>
        : null
    )
  }

  function MedicationNotification() {
    return (
      medications.length > 0
        ? <List.Accordion id={ 2 } title='Medications'
          titleStyle={ { color: Colors.text, fontWeight: 'bold' } }
          theme={ DefaultTheme }
          style={ styles.listStart }
        >
          {
            medications.map((m, index) =>
              <List.Item key={ 'PU-' + index }
                style={ { backgroundColor: Colors.surface, marginBottom: 1 } }
                title={ 'Medication Refill on ' + m.refillDate.toDateString() }
                titleStyle={ [ styles.text, { textTransform: 'capitalize' } ] }
                description={ m.medications.reduce<string[]>((a, { medicine }) => [ ...a, medicine ], []).join(', ') }
                descriptionStyle={ [ styles.text ] }
              />
            )
          }
        </List.Accordion>
        : null
    )
  }
}

export default withResubAutoSubscriptions(HomePage)

const styles = StyleSheet.create({
  cardEnd: {
    backgroundColor: barColor,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  listStart: {
    marginTop: 10,
    backgroundColor: barColor,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  title: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 40
  },
  subtitle: {
    fontWeight: '300',
    marginBottom: 10,
    fontSize: 20
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