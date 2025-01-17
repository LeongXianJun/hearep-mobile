import React, { FC, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { withResubAutoSubscriptions } from 'resub'
import { Text, Card, Divider, Paragraph } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../../styles'
import { DateUtil } from '../../../utils'
import { AppContainer } from '../../common'
import {
  UserStore, HealthRecordStore, LabTestResult, AppointmentStore, Appointment
} from '../../../stores'

const barColor = Colors.primaryVariant

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const LabTestPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Lab Test Result',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const medicalStaff = UserStore.getMedicalStaff()
  const labTestResult = HealthRecordStore.getSelectedLTRRecord()
  const appointments = AppointmentStore.getGroupedAppointments()
  const { Completed } = appointments

  const [ appointment, setAppointment ] = useState<Appointment>()
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    if (labTestResult && labTestResult.type === 'Lab Test Result' && labTestResult.appId) {
      setAppointment(Completed.find(app => app.id === labTestResult.appId))
    }
  }, [ labTestResult ])

  useEffect(() => {
    if (medicalStaff.length === 0) {
      UserStore.fetchAllMedicalStaff()
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [ medicalStaff ])

  return (
    <AppContainer isLoading={ isLoading }>
      <View style={ { flex: 1, marginTop: 10 } }>
        {
          labTestResult
            ? <>
              { RecordInformation(labTestResult) }
              {
                appointment
                  ? AppointmentDetail(appointment)
                  : undefined
              }
              { LabTestResult(labTestResult) }
            </>
            : undefined
        }
      </View>
    </AppContainer>
  )

  function RecordInformation(record: LabTestResult) {
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
              <Text style={ styles.text }>{ 'Test Title' }</Text>
            </View>
            <View style={ { flex: 3 } }>
              <Text style={ styles.text }>{ record.title }</Text>
            </View>
          </View>
          <View style={ { flex: 1, flexDirection: 'row', marginVertical: 10 } }>
            <View style={ { flex: 2 } }>
              <Text style={ styles.text }>{ 'Comment' }</Text>
            </View>
            <View style={ { flex: 3 } }>
              <Text style={ styles.text }>{ record.comment }</Text>
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

  function LabTestResult(record: LabTestResult) {
    return (
      <Card style={ [ { flex: 1 }, styles.lastView ] }>
        <Card.Title title='Lab Test Result' style={ styles.cardStart } />
        <Card.Content style={ { flex: 1 } }>
          {
            record.data.map(({ field, value, normalRange }, index) =>
              <React.Fragment key={ 'r-' + index }>
                { index !== 0 ? <Divider style={ { marginVertical: 5 } } /> : undefined }
                <View style={ { marginVertical: 5 } }>
                  <View style={ { flex: 1, marginVertical: 5 } }>
                    <Text style={ styles.text }>{ field }</Text>
                  </View>
                  <View style={ { flex: 1, flexDirection: 'row' } }>
                    <View style={ { flex: 2 } }>
                      <Text style={ styles.text }>{ value }</Text>
                    </View>
                    <View style={ { flex: 3 } }>
                      <Text style={ styles.text }>{ normalRange }</Text>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            )
          }
        </Card.Content>
        <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
      </Card>
    )
  }
}

export default withResubAutoSubscriptions(LabTestPage)

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
  }
})