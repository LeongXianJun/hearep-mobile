import React from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native'
import {
  Text
} from 'react-native-paper'
import { Colors } from '../../../styles'
import { AppointmentC } from '../../../connections'

const barColor = '#e982f6'

// add close layout -- optional
export default function GetNumberPage({navigation}) {
  navigation.setOptions({
    title: 'Get a Number',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const turn = Math.round(Math.random() * 50)
  const width = Dimensions.get('window').width * 0.5

  const process = () => {
    AppointmentC.setNewAppointmentDetail('turn', turn)
    navigation.navigate('Appointment/Confirmation')
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={barColor}/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <Text style={styles.instruction}>{'Click this to get this number and queue up'}</Text>
          <TouchableOpacity style={[styles.circle, {width: width, height: width, borderRadius: width / 2}]} onPress={process} activeOpacity={0.75}>
            <Text style={styles.num}>{turn}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.background 
  },
  content: {
    minHeight: Dimensions.get('window').height - StatusBar.currentHeight - 60,
    marginHorizontal: '10%', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  instruction: {
    fontSize: 26,
    textAlign: 'center',
    marginHorizontal: '5%'
  },
  circle: {
    marginVertical: 20,
    backgroundColor: barColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  num: {
    fontWeight: 'bold',
    fontSize: 100
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  }
})