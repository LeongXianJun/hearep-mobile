import React, { useEffect, useState, FC } from 'react'
import { View, StyleSheet, Dimensions, AsyncStorage } from 'react-native'
import {
  Text, Title, Card, Button, Divider, Paragraph
} from 'react-native-paper'
import CalendarEvents from 'react-native-calendar-events'
import Carousel from 'react-native-snap-carousel'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { DateUtil } from '../../../utils'
import { AppContainer } from '../../common'
import {
  UserStore, HealthRecordStore, HealthPrescription, MedicationRecord, AppointmentStore,
  Appointment
} from '../../../stores'

const barColor = '#4cb5f5'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const HealthPrescriptionPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Health Prescription',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const width = Dimensions.get('window').width
  const medicalStaff = UserStore.getMedicalStaff()
  const healthPrescription = HealthRecordStore.getSelectedHPRecord()
  const appointments = AppointmentStore.getGroupedAppointments()
  const { Completed } = appointments

  const [ snackMessage, setSnackMessage ] = useState<string>()
  const [ appointment, setAppointment ] = useState<Appointment>()
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    if (healthPrescription && healthPrescription.type === 'Health Prescription' && healthPrescription.appId) {
      Promise.resolve(
        setAppointment(Completed.find(app => app.id === healthPrescription.appId))
      ).finally(() => setIsLoading(false))
    }
  }, [ healthPrescription ])

  useEffect(() => {
    if (medicalStaff.length === 0)
      UserStore.fetchAllMedicalStaff()
  }, [ medicalStaff ])

  return (
    <AppContainer isLoading={ isLoading } snackMessage={ snackMessage }>
      <View style={ { flex: 1, marginTop: 10 } }>
        {
          healthPrescription
            ? <>
              { RecordInformation(healthPrescription) }
              {
                appointment
                  ? AppointmentDetail(appointment)
                  : undefined
              }
              {
                healthPrescription.medicationRecords.length > 0
                  ? MedicationRecords(healthPrescription.medicationRecords)
                  : undefined
              }
            </>
            : undefined
        }
      </View>
    </AppContainer>
  )

  function RecordInformation(record: HealthPrescription) {
    return (
      <Card style={ { marginVertical: 10 } }>
        <Card.Title title={ 'Record Information' } style={ styles.cardStart } />
        <Card.Content>
          <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
            <View style={ { flex: 2 } }>
              <Text style={ styles.text }>{ 'Consultation Date' }</Text>
            </View>
            <View style={ { flex: 3 } }>
              <Text style={ styles.text }>{ record.date.toDateString() }</Text>
            </View>
          </View>
          <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
            <View style={ { flex: 2 } }>
              <Text style={ styles.text }>{ 'Illness' }</Text>
            </View>
            <View style={ { flex: 3 } }>
              <Text style={ styles.text }>{ record.illness }</Text>
            </View>
          </View>
          <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
            <View style={ { flex: 2 } }>
              <Text style={ styles.text }>{ 'Clinical Opinion' }</Text>
            </View>
            <View style={ { flex: 3 } }>
              <Paragraph style={ styles.text }>{ record.clinicalOpinion }</Paragraph>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
      </Card>
    )
  }

  function AppointmentDetail(app: Appointment) {
    const ms = medicalStaff.find(({ id }) => id === app.medicalStaffId)
    return (
      <Card style={ { marginVertical: 10 } }>
        <Card.Title title={ 'Appointment Detail' } style={ styles.cardStart } />
        <Card.Content>
          <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
            <View style={ { flex: 2 } }>
              <Text style={ styles.text }>{ 'Medical Staff' }</Text>
            </View>
            <View style={ { flex: 3 } }>
              <Text style={ styles.text }>{ ms?.username }</Text>
            </View>
          </View>
          <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
            <View style={ { flex: 2 } }>
              <Text style={ styles.text }>{ 'Address' }</Text>
            </View>
            <View style={ { flex: 3 } }>
              <Paragraph style={ styles.text }>{ app.address }</Paragraph>
            </View>
          </View>
          { app.type === 'byTime'
            ? <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
              <View style={ { flex: 2 } }>
                <Text style={ styles.text }>{ 'Time' }</Text>
              </View>
              <View style={ { flex: 3 } }>
                <Text style={ styles.text }>{ DateUtil.hour12(app.time) }</Text>
              </View>
            </View>
            : <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
              <View style={ { flex: 2 } }>
                <Text style={ styles.text }>{ 'Type' }</Text>
              </View>
              <View style={ { flex: 3 } }>
                <Text style={ styles.text }>{ 'Walk-in' }</Text>
              </View>
            </View>
          }
        </Card.Content>
        <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
      </Card>
    )
  }

  function MedicationRecords(mrs: MedicationRecord[]) {
    const addEvent = (mr: MedicationRecord) => () =>
      CalendarEvents.authorizationStatus()
        .then(async status =>
          status !== 'authorized'
            ? await CalendarEvents.authorizeEventStore()
            : status
        ).then(status => {
          if (status === 'authorized') {
            CalendarEvents.findCalendars().then(allC => {
              const primaryC = allC.find(c => c.isPrimary)
              if (primaryC) {
                CalendarEvents.saveEvent('Medication Refill', {
                  startDate: mr.refillDate.toISOString(), endDate: mr.refillDate.toISOString(),
                  allDay: true, location: appointment?.address, calendarId: primaryC.id
                }).then(eventId => {
                  AsyncStorage.setItem(mr.id, eventId)
                    .then(() => setSnackMessage('Medication Reminder Added.'))
                })
              }
            }).catch(err => console.log(err))
          }
        })

    const RefillButton: FC<{ item: MedicationRecord }> = ({ item }) => {
      const [ eventId, setEventId ] = useState('')
      useEffect(() => {
        AsyncStorage.getItem(item.id).then(id => {
          if (id !== null) {
            setEventId(id)
          }
        })
      }, [])
      return eventId === ''
        ? < Card.Actions >
          <Button mode='contained' labelStyle={ { color: 'white', paddingHorizontal: 10 } } style={ styles.button } onPress={ addEvent(item) }>{ 'Add Reminder for Refill' }</Button>
        </Card.Actions>
        : null
    }

    const renderItem = ({ item, index }: { item: MedicationRecord, index: number }) =>
      <Card key={ 'mr-' + index } style={ { flex: 1 } }>
        <Card.Title title={ 'Refill by ' + item.refillDate.toDateString() } style={ styles.cardStart } />
        <Card.Content style={ { flex: 1 } }>
          {
            item.medications.map((m, index) =>
              <React.Fragment key={ 'm-' + index }>
                { index !== 0 ? <Divider style={ { marginVertical: 5 } } /> : undefined }
                <View style={ { marginVertical: 5 } }>
                  <View style={ { flex: 1, marginVertical: 5 } }>
                    <Text style={ styles.text }>{ m.medicine }</Text>
                  </View>
                  <View style={ { flex: 1, flexDirection: 'row' } }>
                    <View style={ { flex: 2 } }>
                      <Text style={ styles.text }>{ m.dosage }</Text>
                    </View>
                    <View style={ { flex: 3 } }>
                      <Text style={ styles.text }>{ m.usage }</Text>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            )
          }
        </Card.Content>
        <RefillButton item={ item } />
        <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
      </Card>

    return (
      <View style={ styles.lastView }>
        <Title style={ { marginVertical: 5 } }>{ 'Medication Records' }</Title>
        <Carousel
          layout='default'
          data={ mrs.map(m => ({ ...m })) }
          renderItem={ renderItem }
          itemWidth={ width * 0.64 } // 0.8 * 0.8
          sliderWidth={ width * 0.8 }
        />
      </View>
    )
  }
}

export default withResubAutoSubscriptions(HealthPrescriptionPage)

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
  header: {
    fontWeight: '500',
    marginVertical: 10,
    fontSize: 24
  },
  text: {
    color: 'black',
    fontSize: 16
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  },
  button: {
    marginVertical: 10,
  }
})