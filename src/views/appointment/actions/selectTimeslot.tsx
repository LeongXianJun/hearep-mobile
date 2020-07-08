import React, { useState, useRef, useEffect, FC } from 'react'
import {
  ScrollView, View, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native'
import { Text, Card, Title } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import { withResubAutoSubscriptions } from 'resub'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '../../../styles'
import { DateUtil } from '../../../utils'
import { AppointmentStore, AvailableTimeSlotStore } from '../../../stores'
import { AppContainer } from '../../common'

const barColor = '#e982f6'

interface PageProp {
  route: any
  navigation: NavigationProp<ParamListBase>
}

const SelectTimeslotPage: FC<PageProp> = ({ route, navigation }) => {
  const rescheduleId = route.params?.rescheduleId
  navigation.setOptions({
    title: rescheduleId ? 'Reschedule Appointment' : 'Select Timeslot',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const { width, height } = Dimensions.get('window')
  const newAppDetail = AppointmentStore.getNewAppDetail()
  const available = AvailableTimeSlotStore.getAvailableTimeSlots()
  const longScroll = height < 500

  const [ dayIndex, setDayIndex ] = useState(0)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ availableSlots, setAvailableSlots ] = useState<Date[]>([])
  const _carousel = useRef<any>(null) // not sure the type

  useEffect(() => {
    if (newAppDetail.medicalStaffId)
      AvailableTimeSlotStore.fetchAvailableTimeslots(newAppDetail.medicalStaffId, new Date())
        .catch(err => console.log(err))
        .finally(() => setIsLoading(false))
  }, [ newAppDetail ])

  useEffect(() => {
    if (available?.daySlots && available.daySlots.length > 0)
      setAvailableSlots(available.daySlots[ 0 ].slots)
  }, [ available ])

  const onIndexChange = (index: number) => {
    setDayIndex(index)
    const slots = available?.daySlots[ dayIndex ]?.slots
    if (slots)
      setAvailableSlots(slots)
  }

  const cont = (time: Date) => () =>
    Promise.resolve(
      AppointmentStore.setNewAppDetail({ time: time })
    ).then(() =>
      navigation.navigate('Appointment/Confirmation', {
        'rescheduleId': rescheduleId
      })
    )

  const onDayPress = (index: number) => {
    _carousel.current.snapToItem(index)
  }

  const renderItem = ({ item, index }: { item: { day: Date, slots: Date[] }, index: number }) => {
    return (
      <TouchableOpacity key={ 'd-' + index } style={ { margin: 5 } } onPress={ () => onDayPress(index) } activeOpacity={ 0.8 }>
        <Card>
          <Card.Content style={ styles.cardStart }>{ }</Card.Content>
          <Card.Content style={ { alignItems: 'center', borderLeftWidth: 2.5, borderRightWidth: 2.5, borderColor: Colors.background } }>
            <Title style={ styles.text }>{ DateUtil.day[ item.day.getDay() ] }</Title>
            <Title style={ styles.text }>{ item.day.getDate() }</Title>
            <Title style={ styles.text }>{ DateUtil.month[ item.day.getMonth() ] }</Title>
          </Card.Content>
          <Card.Actions style={ styles.cardEnd }>{ }</Card.Actions>
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <AppContainer isLoading={ isLoading } ContentStyle={ longScroll && { flex: 1 } }>
      <View style={ [ styles.firstView ] }>
        <Title>Select a { rescheduleId ? 'new ' : '' }Day</Title>
        <View>
          <Carousel
            ref={ _carousel }
            layout='default'
            data={ available?.daySlots ?? [] }
            enableSnap
            snapToAlignment='center'
            onSnapToItem={ index => onIndexChange(index) }
            renderItem={ renderItem }
            itemWidth={ width * 0.25 }
            sliderWidth={ width * 0.8 }
          />
        </View>
        <Title>Pick a { rescheduleId ? 'new ' : '' }Time</Title>
        <ScrollView scrollEnabled={ !longScroll } style={ [ styles.lastView, { marginVertical: 10 } ] }>
          <View>
            {
              availableSlots.map((as, index) =>
                <TouchableOpacity key={ 'slot-' + index } style={ styles.bar } onPress={ cont(as) }>
                  <View style={ styles.row }>
                    <View style={ { flex: 1, justifyContent: 'center' } }>
                      <Text style={ { fontSize: 20, color: 'black' } }>{ DateUtil.hour12(as) }</Text>
                    </View>
                    <MaterialCommunityIcons name='chevron-right' color='black' size={ 36 } />
                  </View>
                </TouchableOpacity>
              )
            }
          </View>
        </ScrollView>
      </View>
    </AppContainer>
  )
}

export default withResubAutoSubscriptions(SelectTimeslotPage)

const styles = StyleSheet.create({
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