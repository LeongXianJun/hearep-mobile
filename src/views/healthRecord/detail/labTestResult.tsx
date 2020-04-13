import React, { useEffect, useState, Fragment } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, 
} from 'react-native'
import {
  Text, Title, DataTable, Card, Button, Divider
} from 'react-native-paper'
import { Colors } from '../../../styles'
import { RecordC, Record, isMedicationRecord, isHealthPrescription, AppointmentC, Appointment, MedicationRecord, isByTime, isLabTestResult, LabTestResult } from '../../../connections'
import Carousel from 'react-native-snap-carousel'

type HealthPrescription = {
  date: Date
  illness: string
  clinicalOpinion: string
}

export default function LabTestPage({route, navigation}) {
  navigation.setOptions({
    title: 'Lab Test Result',
    headerStyle: {
      backgroundColor: '#34675c',
    },
    headerTintColor: '#ffffff'
  })
  const { id } = route.params
  const [ record, setRecord ] = useState<Record>()

  useEffect(() => {
    const r = RecordC.getRecord(id)
    if(r && isLabTestResult(r)) {
      setRecord(r)
    }
  }, [id])

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor='#34675c'/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{flex: 1, marginTop: 10}}>
            {
              record && isLabTestResult(record)
              ? <>
                  { RecordInformation(record) }
                  { LabTestResult(record) }
                </>
              : undefined
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )

  function RecordInformation(record: LabTestResult) {
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
              <Text style={styles.text}>{'Test Title'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{record.title}</Text>                          
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{'Comment'}</Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.text}>{record.comment}</Text>                          
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  function LabTestResult(record: LabTestResult) {
    return (
      <Card style={[{flex: 1}, styles.lastView]}>
        <Card.Title title='Lab Test Result' titleStyle={{color: 'black'}}/>
        <Card.Content style={{flex: 1}}>
          {
            record.data.map(({field, result, normalRange}, index) =>
              <Fragment key={'r-' + index}>
                { index !==0? <Divider style={{marginVertical: 5}}/>: undefined }
                <View style={{flex: 1, marginVertical: 5}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.text}>{ field }</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 2}}>
                      <Text style={styles.text}>{ result }</Text>
                    </View>
                    <View style={{flex: 3}}>
                      <Text style={styles.text}>{ normalRange }</Text>
                    </View>
                  </View>
                </View>
              </Fragment>
            )
          }
        </Card.Content>
      </Card>
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
  }
})