import React, { FC, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions
} from 'react-native'
import {
  Text, Card, Title, TouchableRipple
} from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { HealthRecordStore, HR } from '../../stores'

const imgs = {
  'Health Prescription': require('../../resources/images/healthPrescription.jpg'),
  'Medication Record': require('../../resources/images/medicationRecord.jpg'),
  'Lab Test Result': require('../../resources/images/labTestResult.jpg')
}

const barColor = '#4cb5f5'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const HealthRecordPage: FC<PageProp> = ({ navigation }) => {
  const { width } = Dimensions.get('window')
  const records = HealthRecordStore.getHealthRecords()

  const { healthPrescriptions, labTestResults } = records

  useEffect(() => {
    HealthRecordStore.fetchPatientRecords()
  }, [])

  const navigate = (category: HR[ 'type' ]) => (record: HR) => () => {
    HealthRecordStore.setSelectedRecord(record)
    switch (category) {
      case 'Health Prescription':
        navigation.navigate('HealthRecord/HealthPrescription')
        break;
      case 'Lab Test Result':
        navigation.navigate('HealthRecord/LabTestResult')
        break;
      default: break;
    }
  }

  const renderItem = (category: HR[ 'type' ]) => ({ item, index }: { item: HR, index: number }) =>
    <TouchableRipple key={ 'c-' + index + '-' + Date.now() } style={ { margin: 5, borderRadius: 5 } } onPress={ navigate(category)(item) } rippleColor="rgba(0, 0, 0, .32)">
      <Card style={ { backgroundColor: barColor } }>
        <Card.Cover source={ imgs[ category ] } />
        <Card.Content>
          <Title>{ item.date.toDateString() }</Title>
        </Card.Content>
      </Card>
    </TouchableRipple>

  return (
    <React.Fragment>
      <StatusBar barStyle='default' />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <Text style={ styles.title }>{ 'All Health Records' }</Text>
          {
            [
              { type: 'Health Prescription' as HR[ 'type' ], data: healthPrescriptions },
              { type: 'Lab Test Result' as HR[ 'type' ], data: labTestResults }
            ].map(({ type, data }) =>
              <View key={ 'l-' + type } style={ { marginVertical: 5 } }>
                <Text style={ [ styles.category, { textTransform: 'capitalize' } ] }>{ type }</Text>
                <Carousel
                  layout='default'
                  data={ data }
                  renderItem={ renderItem(type) }
                  itemWidth={ width * 0.64 } // 0.8 * 0.8
                  sliderWidth={ width * 0.8 }
                />
              </View>
            )
          }
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}

export default withResubAutoSubscriptions(HealthRecordPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    minHeight: Dimensions.get('window').height - (StatusBar.currentHeight ?? 0) - 60,
    marginHorizontal: '10%'
  },
  title: {
    fontWeight: 'bold',
    marginTop: 25,
    fontSize: 35
  },
  subtitle: {
    fontWeight: '300',
    marginVertical: 10,
    fontSize: 20
  },
  category: {
    fontWeight: '700',
    marginVertical: 10,
    fontSize: 24
  },
  button: {
    marginVertical: 10,
    width: '60%',
    height: '15%'
  },
  textInput: {
    marginVertical: 10,
    width: '80%'
  }
})