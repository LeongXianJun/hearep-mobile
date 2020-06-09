import React, { FC } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Text, Card, Divider
} from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../../styles'
import { HealthRecordStore, LabTestResult } from '../../../stores'

const barColor = '#4cb5f5'

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
  const labTestResult = HealthRecordStore.getSelectedLTRRecord()

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={ barColor } />
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ { flex: 1 } } contentContainerStyle={ styles.content }>
          <View style={ { flex: 1, marginTop: 10 } }>
            {
              labTestResult
                ? <>
                  { RecordInformation(labTestResult) }
                  { LabTestResult(labTestResult) }
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