import React, { useState, useRef, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native'
import {
  Text, Button, Card, Title
} from 'react-native-paper'
import { Colors } from '../../../styles'
import { AppointmentC, FixedTime } from '../../../connections'
import Carousel from 'react-native-snap-carousel'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { day, month } from '../../commons'

const barColor = '#e982f6'
//  normal and reschedule version (just change some text)
export default function SelectTimeslotPage({route, navigation}) {
  const rescheduleId = route.params?.rescheduleId
  navigation.setOptions({
    title: rescheduleId? 'Reschedule Appointment': 'Select Timeslot',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const { width, height } = Dimensions.get('window')
  const wt = AppointmentC.workingTimes[0]
  const timeslots = wt.type === 'byTime'? wt.timeslots: undefined
  const [ dayIndex, setDayIndex ] = useState(0)
  const [ availableSlots, setAvailableSlots ] = useState(timeslots[0].slots)
  const _carousel = useRef(null)
  const longScroll = height < 500

  useEffect(() => {
    setAvailableSlots(timeslots[dayIndex].slots)
  }, [dayIndex])

  const cont = (index: number) => () => {
    AppointmentC.setNewAppointmentDetail('date', nthDay(dayIndex))
    AppointmentC.setNewAppointmentDetail('time', FixedTime[index])
    navigation.navigate('Appointment/Confirmation', {
      'rescheduleId': rescheduleId
    })
  }

  const nthDay = (num: number): Date => new Date(Date.now() + (num + 1) * 24 * 60 * 60000)

  const onDayPress = (index) => {
    _carousel.current.snapToItem(index)
  }

  const renderItem = ({item, index}) => {
    const currentDay = nthDay(index)
    return (
      <TouchableOpacity key={'d-' + index} style={{margin: 5}} onPress={() => onDayPress(index)} activeOpacity={0.8}>
        <Card>
          <Card.Content style={styles.cardStart}>{}</Card.Content>
          <Card.Content style={{alignItems: 'center', borderLeftWidth: 2.5, borderRightWidth: 2.5, borderColor: Colors.background}}>
            <Title style={styles.text}>{day[currentDay.getDay()]}</Title>
            <Title style={styles.text}>{currentDay.getDate()}</Title>
            <Title style={styles.text}>{month[currentDay.getMonth()]}</Title>
          </Card.Content>
          <Card.Actions style={styles.cardEnd}>{}</Card.Actions>
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={barColor}/>
      <SafeAreaView style={styles.container}>
        <ScrollView scrollEnabled={longScroll} style={{flex: 1}} contentContainerStyle={longScroll? styles.content: styles.longScrollContent}>
          <View style={[styles.firstView, {flex: 7}]}>
            <Title>Select a {rescheduleId? 'new ': ''}Day</Title>
            <View>
              <Carousel
                ref={_carousel}
                layout='default'
                data={timeslots}
                enableSnap
                snapToAlignment='center'
                onSnapToItem={index => setDayIndex(index)}
                renderItem={renderItem}
                itemWidth={width * 0.25}
                sliderWidth={width * 0.8}
              />
            </View>
            <Title>Pick a {rescheduleId? 'new ': ''}Time</Title>
            <ScrollView scrollEnabled={!longScroll} style={[styles.lastView, { marginVertical: 10 }]}>
              <View>
                {
                  availableSlots.map((as, index) =>
                    <TouchableOpacity key={'slot-' + index} style={styles.bar} onPress={cont(as)}>
                      <View style={styles.row}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <Text style={{fontSize: 20, color: 'black'}}>{FixedTime[as - 1]}</Text>
                        </View>
                        <MaterialCommunityIcons name='chevron-right' color='black' size={36}/>
                      </View>
                    </TouchableOpacity>
                  )
                }
              </View>
            </ScrollView>
          </View>
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
  longScrollContent: {
    flex: 1,
    maxHeight: Dimensions.get('window').height - StatusBar.currentHeight - 60,
    marginHorizontal: '10%'
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
    borderBottomLeftRadius: 5,
    borderColor: Colors.background
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 35
  },
  text: {
    color: 'black'
  },
  bar: {
    backgroundColor: barColor, 
    borderRadius: 5,
    marginVertical: 3,
    paddingHorizontal: 15
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  buttons: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    marginVertical: 5,
    width: '60%',
    height: '15%',
    minHeight: 40
  },
  firstView: {
    marginTop: 25
  },
  lastView: {
    marginTop: 10,
    marginBottom: 25,
  }
})