import React, { useState, FC, ReactText, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Text, List, DefaultTheme, Card
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '../../styles'
import { UserStore, HealthRecordStore, MedicationRecord } from '../../stores'
import { AppointmentC } from '../../connections'

const barColor = Colors.primaryVariant

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const HomePage: FC<PageProp> = ({ navigation }) => {
  const CurrentUser = UserStore.getUser()
  const records = HealthRecordStore.getHealthRecords()
  const [ expandId, setExpandId ] = useState(1)

  useEffect(() => {
    return UserStore.unsubscribe
  }, [ CurrentUser ])

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ Colors.primaryVariant } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <Text style={ styles.title }>{ 'Welcome,\n' + CurrentUser?.username }</Text>
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
          <View style={ styles.lastView }>
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
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )

  function AppointmentNotification() {
    const nearingAppointments = AppointmentC.nearing

    return (
      <List.Accordion id={ 1 } title='Appointments'
        titleStyle={ { color: Colors.text, fontWeight: 'bold' } }
        theme={ DefaultTheme }
        style={ styles.listStart }
      >
        {
          nearingAppointments.map(({ date, address, medicalStaff }, index) =>
            <List.Item key={ 'PU-' + index }
              style={ { backgroundColor: Colors.surface, marginBottom: 1 } }
              title={ 'Appointment on ' + date.toDateString() }
              titleStyle={ [ styles.text, { textTransform: 'capitalize' } ] }
              description={ address + '\n' + medicalStaff }
              descriptionStyle={ [ styles.text ] }
            />
          )
        }
      </List.Accordion>
    )
  }

  function MedicationNotification() {
    const { healthPrescriptions } = records
    const medications = healthPrescriptions.reduce<MedicationRecord[]>((all, hp) => [ ...all, ...hp.medicationRecords ], [])
    return (
      <List.Accordion id={ 2 } title='Medications'
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
    )
  }
}

export default withResubAutoSubscriptions(HomePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
    marginHorizontal: '10%'
  },
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