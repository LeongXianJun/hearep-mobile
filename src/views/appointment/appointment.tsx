import React, { useState, useEffect } from 'react'
import {
  StatusBar, SafeAreaView, ScrollView, View, StyleSheet, Dimensions,
} from 'react-native'
import {
  Text, List, Searchbar, Title, Divider, Button, Card
} from 'react-native-paper'
import Modal from 'react-native-modal'
import { Colors } from '../../styles'
import { AppointmentC, Appointment, UserC } from '../../connections'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const avatar = {
  M: () => require('../../resources/images/makeAppointmentFemale.jpg'),
  F: () => require('../../resources/images/makeAppointmentMale.jpg')
}

const barColor = '#e982f6'

export default function AppointmentPage({navigation}) {
  navigation.setOptions({
    title: 'Appointments',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const { gender } = UserC.currentUser
  const [ expandId, setExpandId ] = useState(1)
  const [ filter, setFilter ] = useState('')
  const [ nearingAppointments, setNearingAppointments ] = useState(AppointmentC.nearing)
  const [ allAppointments, setAllAppointments ] = useState(AppointmentC.appointmentDB)
  const [ selectedAppointment, setSelectedAppointment ] = useState<Appointment>()

  const refreshData = () => {
    setNearingAppointments(AppointmentC.nearing)
    setAllAppointments(AppointmentC.appointmentDB)
  }

  return (
    <React.Fragment>
      <StatusBar barStyle='default' animated backgroundColor={barColor}/>
      <AppointmentDialog onClose={() => setSelectedAppointment(undefined)} refresh={refreshData} appointment={selectedAppointment}/>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
          <View style={{marginTop: 25, flexDirection: 'row-reverse'}}>
            <Button mode='text' onPress={() => navigation.navigate('Appointment/History')}>{'History'}</Button>
          </View>
          <Card style={{marginVertical: 5}} onPress={() => navigation.navigate('Appointment/SelectMedicalStaff')}>
            <Card.Cover source={avatar[gender]()}/>
            <Card.Content style={styles.cardEnd}>
              <View style={{flex: 1, marginTop: 10, flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{fontSize: 16}}>{'Schedule an Appointment'}</Text>
                </View>
                <MaterialCommunityIcons name='chevron-right' color={Colors.text} size={24}/>
              </View>
            </Card.Content>
          </Card>
          <View style={styles.lastView}>
            <List.Section>
              <List.AccordionGroup
                expandedId={expandId}
                onAccordionPress={(id: number) => setExpandId(id)}
              >
                { NearingAppointments() }
                { AllAppointments() }
              </List.AccordionGroup>
            </List.Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )

  function NearingAppointments() {
    const count = nearingAppointments.length

    return (
      count > 0
      ? <List.Accordion id={1} title={count + ' Nearing Appointment' + (count > 1? 's': '')}
          titleStyle={{color: Colors.text, fontWeight: 'bold'}}
          style={styles.listStart}
        >
          {
            nearingAppointments.map(({date, address, medicalStaff}, index) => 
              <List.Item key={'PU-' + index} 
                style={{backgroundColor: Colors.surface, marginBottom: 1}}
                title={ 'Appointment on ' + date.toDateString() }
                titleStyle={[styles.text, {textTransform: 'capitalize'}]}
                description={medicalStaff + '\n' + address}
                descriptionNumberOfLines={5}
                descriptionStyle={[styles.text]}
              />
            )
          }
        </List.Accordion>
      : null
    )
  }

  function AllAppointments() {
    const count = allAppointments.length

    return (
      <List.Accordion id={2} title={'All Appointment' + (count > 1? 's': '')}
        titleStyle={{color: Colors.text, fontWeight: 'bold'}}
        style={styles.listStart}
      >
        <Searchbar
          placeholder="Search"
          iconColor={barColor}
          onChangeText={val => setFilter(val)}
          style={{ elevation: 0, borderRadius: 0, borderBottomWidth: 1, borderColor: barColor }}
          inputStyle={{color: barColor}}
          value={filter}
        />
        {
          allAppointments.filter(u => u.medicalStaff.toLowerCase().includes(filter.toLowerCase())).map((app, index) => 
            <List.Item key={'PU-' + index} 
              style={{backgroundColor: Colors.surface, marginBottom: 1}}
              title={ 'Appointment on ' + app.date.toDateString() }
              titleStyle={[styles.text, {textTransform: 'capitalize'}]}
              description={app.medicalStaff + '\n' + app.address}
              descriptionStyle={[styles.text]}
              descriptionNumberOfLines={5}
              right={props => 
                <View style={{justifyContent: 'center'}}>
                  <MaterialCommunityIcons {...props} color={barColor} name='details' size={24}/>
                </View>
              }
              onPress={() => setSelectedAppointment(app)}
            />
          )
        }
      </List.Accordion>
    )
  }
}

function AppointmentDialog(props: AppointmentDialogProps) {
  const { appointment, onClose } = props
  const navigation = useNavigation()
  const [ show, setShow ] = useState(false)

  useEffect(() => {
    if(appointment !== undefined) {
      setShow(true)
    }
  }, [props.appointment])

  const close = (path?: string) => () => {
    onClose()
    if(path) {
      navigation.navigate(path, {
        'rescheduleId': appointment.id
      })
    }
  }

  const cancel = () => {
    const { refresh } = props
    AppointmentC.cancelAppointment(appointment)
    refresh()
    close()()
  }

  return (
    show
    ? <View style={dialogStyles.dialog}>
        <Modal
          backdropColor='rgba(211, 211, 211, 0.4)'
          isVisible={appointment !== undefined}
          onModalHide={() => setShow(false)}
          useNativeDriver
          onBackdropPress={() => onClose()}
        >
          <View style={dialogStyles.centeredView}>
            <View style={dialogStyles.modalView}>
              <Title style={{color: 'black'}}>{'Appointment Detail'}</Title>
              {
                appointment
                ? [
                    { field: 'Date', val: appointment.date.toDateString() },
                    { field: 'Medical Staff', val: appointment.medicalStaff },
                    { field: 'Address', val: appointment.address },
                    appointment.type === 'byTime'
                    ? { field: 'Time', val: appointment.time, isNormalText: true }
                    : appointment.type === 'byNumber'
                      ? { field: 'Turn Number', val: appointment.turn, isNormalText: true }
                      : null                    
                  ].map(({field, val, isNormalText}, index) => 
                    <View key={'bi-' + index} style={{flexDirection: 'row', marginVertical: 10}}>
                      <View style={{flex: 2}}>
                        <Text style={styles.text}>{ field }:</Text>
                      </View>
                      <View style={{flex: 3}}>
                        <Text style={[styles.text, isNormalText? {}:{textTransform: 'capitalize'}]}>{ val }</Text>                          
                      </View>
                    </View>
                  )
                : null
              }
              <Divider style={{marginVertical: 5}}/>
              <View style={styles.buttons}>
                {
                  appointment?.type === 'byTime'
                  ? <Button onPress={close('Appointment/SelectTimeslot')} mode='contained' style={[styles.button, { backgroundColor: 'blue' }]} labelStyle={{color: Colors.text}}>{'Reschedule Appointment'}</Button>
                  : null
                }
                <Button onPress={cancel} labelStyle={{color: 'red'}}>{'Cancel Appointment'}</Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    : null
  )
}

interface AppointmentDialogProps {
  onClose: Function
  refresh: Function
  appointment: Appointment
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
  cardEnd: {
    backgroundColor: barColor, 
    borderBottomRightRadius: 5, 
    borderBottomLeftRadius: 5
  },
  listStart: {
    marginTop: 10,
    backgroundColor: barColor, 
    borderTopRightRadius: 5, 
    borderTopLeftRadius: 5
  },
  title: {
    fontWeight: 'bold',
    marginTop: 25,
    fontSize: 35
  },
  buttons: {
    marginVertical: 5,
    borderRadius: 5,
  },
  button: {
    marginVertical: 5,
    borderRadius: 5,
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

const dialogStyles = StyleSheet.create({
  dialog: {
    position: 'absolute',
    justifyContent: "center",
    alignItems: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
})