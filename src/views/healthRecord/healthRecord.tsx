import React from 'react'
import {
  StatusBar, Platform, KeyboardAvoidingView, ScrollView, View, StyleSheet, Dimensions
} from 'react-native'
import {
  Text, Card, Title, TouchableRipple
} from 'react-native-paper'
import { Colors } from '../../styles'
import { RecordC } from '../../connections'
import Carousel from 'react-native-snap-carousel'

const imgs = {
  'health prescription': require('../../resources/images/healthPrescription.jpg'),
  'medication record': require('../../resources/images/medicationRecord.jpg'),
  'lab test result': require('../../resources/images/labTestResult.jpg')
}

export default function HealthRecordPage({navigation}) {
  const groups = RecordC.allRecords()
  const { width } = Dimensions.get('window')

  const navigate = (category) => (id) => () => {
    switch(category) {
      case 'health prescription':
        navigation.navigate('HealthRecord/HealthPrescription', { id })
        break;
      case 'lab test result':
        navigation.navigate('HealthRecord/LabTestResult', { id })
        break;
      default: break;
    }
  }

  const renderItem = (category) => ({item, index}) => 
    <TouchableRipple key={'c-' + index + '-' + Date.now()} style={{margin: 5, borderRadius: 5}} onPress={navigate(category)(item.id)} rippleColor="rgba(0, 0, 0, .32)">
      <Card>
        <Card.Cover source={imgs[category]}/>
        <Card.Content>
          <Title style={{color: 'black'}}>{item.date.toDateString()}</Title>
        </Card.Content>
      </Card>
    </TouchableRipple>

  return (
    <React.Fragment>
      <StatusBar barStyle='default'/>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <Text style={styles.title}>{'All Health Records'}</Text>
          {
            groups.map(({type, data}) => 
              <View key={'l-' + type} style={{marginVertical: 5}}>
                <Text style={[styles.category, {textTransform: 'capitalize'}]}>{type}</Text>
                <Carousel
                  layout='default'
                  data={data}
                  renderItem={renderItem(type)}
                  itemWidth={width * 0.64} // 0.8 * 0.8
                  sliderWidth={width * 0.8}
                />
              </View>
            )
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.background 
  },
  content: {
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight,
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