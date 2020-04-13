import React, { useEffect, useState, Fragment } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, 
} from 'react-native'
import {
  Text, Title, Card, Button, Divider, Snackbar, Paragraph
} from 'react-native-paper'
import { Colors } from '../../../styles'
import { RecordC, Record, isMedicationRecord, isHealthPrescription, AppointmentC, Appointment, isByTime } from '../../../connections'
import Carousel from 'react-native-snap-carousel'

type HealthPrescription = {
  date: Date
  illness: string
  clinicalOpinion: string
}

export default function HealthPrescriptionPage({route, navigation}) {
  navigation.setOptions({
    title: 'Health Prescription',
    headerStyle: {
      backgroundColor: '#34675c',
    },
    headerTintColor: '#ffffff'
  })
  const { id } = route.params
  const [ record, setRecord ] = useState<Record>()
  const [ appointment, setAppointment ] = useState<Appointment>()
  const [ medicationRecords, setMedicationRecords ] = useState<Record[]>()
  const [ snackVisible, setSnackVisible ] = useState(false)

  useEffect(() => {
    const r = RecordC.getRecord(id)
    if(r && isHealthPrescription(r)) {
      setRecord(r)
      setAppointment(AppointmentC.getAppointment(r.appID))
      setMedicationRecords(RecordC.getMedicationRecords(r.id))
    }
  }, [id])

  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 1, marginTop: 10}}>
            {
              record && isHealthPrescription(record)
              ? <>
                  { RecordInformation(record) }
                  {
                    appointment
                    ? AppointmentDetail(appointment)
                    : undefined
                  }
                  {
                    medicationRecords
                    ? MedicationRecords(medicationRecords)
                    : undefined
                  }
                </>
              : undefined
            }
          </View>
        </ScrollView>
      </SafeAreaView>
      <Snackbar
        visible={snackVisible}
        duration={Snackbar.DURATION_MEDIUM}
        onDismiss={() => setSnackVisible(false)}
      >
        {'Medication Reminder Added.'}
      </Snackbar>
    </React.Fragment>
  )

  function RecordInformation(record: HealthPrescription) {
    return (
      <Card style={{marginVertical: 10}}>
        <Card.Title title={'Record Information'} titleStyle={{color: 'black'}}/>
        <Card.Content>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{'Consultation Date'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{record.date.toDateString()}</Text>                          
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{'Illness'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{record.illness}</Text>                          
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{'Clinical Opinion'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Paragraph style={styles.text}>{record.clinicalOpinion}</Paragraph>                          
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  function AppointmentDetail(app: Appointment) {
    return (
      <Card style={{marginVertical: 10}}>
        <Card.Title title={'Appointment Detail'} titleStyle={{color: 'black'}}/>
        <Card.Content>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{'Medical Staff'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{app.medicalStaff}</Text>                          
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{'Address'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Paragraph style={styles.text}>{app.address}</Paragraph>                          
            </View>
          </View>
          {isByTime(app)
          ? <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
              <View style={{flex: 2}}>
                <Text style={styles.text}>{'Time'}</Text>
              </View>
              <View style={{flex: 3}}>
                <Text style={styles.text}>{app.time}</Text>                          
              </View>
            </View>
          : <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
              <View style={{flex: 2}}>
                <Text style={styles.text}>{'Type'}</Text>
              </View>
              <View style={{flex: 3}}>
                <Text style={styles.text}>{'Walk-in'}</Text>                          
              </View>
            </View>
          }
        </Card.Content>
      </Card>
    )
  }

  function MedicationRecords(mrs: Record[]) {
    const width = Dimensions.get('window').width
    const renderItem = ({item, index}: {item: Record, index: number}) => 
      <Card key={'mr-' + index} style={{flex: 1}}>
        <Card.Content style={{flex: 1}}>
          {
            isMedicationRecord(item)
            ? item.medications.map((m, index) => 
                <Fragment key={'m-' + index}>
                  { index !== 0? <Divider style={{marginVertical: 5}}/>: undefined}
                  <View style={{flex: 1, marginVertical: 5}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.text}>{ m.medicine }</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={{flex: 2}}>
                        <Text style={styles.text}>{ m.dosage }</Text>
                      </View>
                      <View style={{flex: 3}}>
                        <Text style={styles.text}>{ m.usage }</Text>
                      </View>
                    </View>
                  </View>
                </Fragment>
              )
            : undefined
          }
        </Card.Content>
        <Card.Actions>
          <Button style={styles.button} onPress={() => setSnackVisible(true)}>{'Add Reminder'}</Button>
        </Card.Actions>
      </Card>
    
    return (
      <View style={styles.lastView}>
        <Title style={{marginVertical: 5}}>{'Medication Records'}</Title>
        <Carousel
          layout='default'
          data={mrs}
          renderItem={renderItem}
          itemWidth={width * 0.64} // 0.8 * 0.8
          sliderWidth={width * 0.8}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.background 
  },
  content: {
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight - 60,
    marginHorizontal: '10%'
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