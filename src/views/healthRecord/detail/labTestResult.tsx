import React, { useEffect, useState, Fragment } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, 
} from 'react-native'
import {
  Text, Card, Divider
} from 'react-native-paper'
import { Colors } from '../../../styles'
import { RecordC, Record, isLabTestResult, LabTestResult } from '../../../connections'

const barColor = '#4cb5f5'

export default function LabTestPage({route, navigation}) {
  navigation.setOptions({
    title: 'Lab Test Result',
    headerStyle: {
      backgroundColor: barColor,
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
      <StatusBar barStyle='default' animated backgroundColor={barColor}/>
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
        <Card.Title title={'Record Information'} style={styles.cardStart}/>
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
        <Card.Actions style={styles.cardEnd}>{}</Card.Actions>
      </Card>
    )
  }

  function LabTestResult(record: LabTestResult) {
    return (
      <Card style={[{flex: 1}, styles.lastView]}>
        <Card.Title title='Lab Test Result' style={styles.cardStart}/>
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
        <Card.Actions style={styles.cardEnd}>{}</Card.Actions>
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