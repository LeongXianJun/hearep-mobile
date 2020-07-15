import React, { FC, useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { withResubAutoSubscriptions } from 'resub'
import { Text, Card, Title, TouchableRipple } from 'react-native-paper'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { AppContainer } from '../common'
import { HealthRecordStore, HR } from '../../stores'

const imgs = {
  'Health Prescription': require('../../resources/images/healthPrescription.jpg'),
  'Medication Record': require('../../resources/images/medicationRecord.jpg'),
  'Lab Test Result': require('../../resources/images/labTestResult.jpg')
}

const barColor = Colors.primaryVariant

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const HealthRecordPage: FC<PageProp> = ({ navigation }) => {
  const { width } = Dimensions.get('window')
  const records = HealthRecordStore.getHealthRecords()
  const { healthPrescriptions, labTestResults } = records

  const [ isLoading, setIsLoading ] = useState(true)

  const onLoad = () => {
    HealthRecordStore.fetchPatientRecords()
      .catch(err => {
        if (err.message.includes('No more record') === false) {
          console.log(err)
        }
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(onLoad, [])

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
    <AppContainer isLoading={ isLoading } onRefresh={ onLoad }>
      <Text style={ styles.title }>{ 'All Health Records' }</Text>
      {
        [
          { type: 'Health Prescription' as HR[ 'type' ], data: healthPrescriptions },
          { type: 'Lab Test Result' as HR[ 'type' ], data: labTestResults }
        ].map(({ type, data }) =>
          <View key={ 'l-' + type } style={ { marginVertical: 5 } }>
            <Text style={ [ styles.category, { textTransform: 'capitalize' } ] }>{ type }</Text>
            {
              data.length > 0
                ? <Carousel
                  layout='default'
                  data={ data }
                  renderItem={ renderItem(type) }
                  itemWidth={ width * 0.64 } // 0.8 * 0.8
                  sliderWidth={ width * 0.8 }
                />
                :
                <Card style={ { height: '25%', backgroundColor: barColor } }>
                  <Card.Content style={ { alignItems: 'center' } }>
                    <Text style={ { textAlignVertical: 'center' } }>{ `No ${type} for now.` }</Text>
                  </Card.Content>
                </Card>
            }
          </View>
        )
      }
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(HealthRecordPage)

const styles = StyleSheet.create({
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