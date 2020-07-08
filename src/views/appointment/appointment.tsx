import React, { useState, useEffect, FC, ReactText } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  Text, List, Searchbar, Title, Divider, Button, Card
} from 'react-native-paper'
import Modal from 'react-native-modal'
import { withResubAutoSubscriptions } from 'resub'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native'

import { Colors } from '../../styles'
import { DateUtil } from '../../utils'
import { AppContainer } from '../common'
import { isUndefined } from '../../utils'
import { UserStore, AppointmentStore, Appointment, MedicalStaff } from '../../stores'

const avatar = {
  M: () => require('../../resources/images/makeAppointmentFemale.jpg'),
  F: () => require('../../resources/images/makeAppointmentMale.jpg')
}

const barColor = '#e982f6'

interface PageProp {
  navigation: NavigationProp<ParamListBase>
}

const AppointmentPage: FC<PageProp> = ({ navigation }) => {
  navigation.setOptions({
    title: 'Appointments',
    headerStyle: {
      backgroundColor: barColor,
    },
    headerTintColor: '#ffffff'
  })
  const CurrentUser = UserStore.getUser()
  const medicalStaff = UserStore.getMedicalStaff()
  const appointments = AppointmentStore.getGroupedAppointments()
  const { Pending, Rejected } = appointments

  const [ gender, setGender ] = useState<'M' | 'F'>('M')
  const [ expandId, setExpandId ] = useState(1)
  const [ filter, setFilter ] = useState('')
  const [ selectedAppointment, setSelectedAppointment ] = useState<Appointment>()
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    Promise.all([
      UserStore.fetchAllMedicalStaff(),
      AppointmentStore.fetchAllAppointments()
    ]).catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (CurrentUser) {
      setGender(CurrentUser.gender)
    }

    return UserStore.unsubscribe
  }, [ CurrentUser ])

  return (
    <AppContainer isLoading={ isLoading }>
      <AppointmentDialog onClose={ () => setSelectedAppointment(undefined) } appointment={ selectedAppointment } />
      <View style={ { marginTop: 25, flexDirection: 'row-reverse' } }>
        <Button mode='text' onPress={ () => navigation.navigate('Appointment/History') }>{ 'History' }</Button>
      </View>
      <Card style={ { marginVertical: 5 } } onPress={ () => navigation.navigate('Appointment/SelectMedicalStaff') }>
        <Card.Cover source={ avatar[ gender ]() } />
        <Card.Content style={ styles.cardEnd }>
          <View style={ { flex: 1, marginTop: 10, flexDirection: 'row', justifyContent: 'center' } }>
            <View style={ { flex: 1, justifyContent: 'center' } }>
              <Text style={ { fontSize: 16 } }>{ 'Schedule an Appointment' }</Text>
            </View>
            <MaterialCommunityIcons name='chevron-right' color={ Colors.text } size={ 24 } />
          </View>
        </Card.Content>
      </Card>
      <View style={ styles.lastView }>
        <List.Section>
          <List.AccordionGroup
            expandedId={ expandId }
            onAccordionPress={ (expandedId: ReactText) => setExpandId(Number.parseInt(expandedId.toString())) }
          >
            { NearingAppointments() }
            { AllAppointments() }
          </List.AccordionGroup>
        </List.Section>
      </View>
    </AppContainer>
  )

  function NearingAppointments() {
    const app = [ ...appointments[ 'Waiting' ], ...appointments[ 'Accepted' ] ]

    return (
      app.length > 0
        ? <List.Accordion id={ 1 } title={ app.length + ' Nearing Appointment' + (app.length > 1 ? 's' : '') }
          titleStyle={ { color: Colors.text, fontWeight: 'bold' } }
          style={ styles.listStart }
        >
          {
            app.map(a => ({ ...a, medicalStaff: medicalStaff.find(ms => ms.id === a.medicalStaffId) }))
              .filter(u => u.medicalStaff?.username.toLowerCase().includes(filter.toLowerCase()))
              .map((app, index) =>
                <List.Item key={ 'PU-' + index }
                  style={ { backgroundColor: Colors.surface, marginBottom: 1 } }
                  title={ 'Appointment on ' + (app.type === 'byTime' ? app.time : app.date).toDateString() }
                  titleStyle={ [ styles.text, { textTransform: 'capitalize' } ] }
                  description={ (app.medicalStaff ? app.medicalStaff.username + '\n' : '') + app.address }
                  descriptionNumberOfLines={ 5 }
                  descriptionStyle={ [ styles.text ] }
                  right={ props =>
                    <View style={ { justifyContent: 'center' } }>
                      <MaterialCommunityIcons { ...props } color={ barColor } name='details' size={ 24 } />
                    </View>
                  }
                  onPress={ () => setSelectedAppointment(app) }
                />
              )
          }
        </List.Accordion>
        : null
    )
  }

  function AllAppointments() {
    return (
      Pending.length > 0 || Rejected.length > 0
        ? <List.Accordion id={ 2 } title={ 'All Appointments' }
          titleStyle={ { color: Colors.text, fontWeight: 'bold' } }
          style={ styles.listStart }
        >
          <Searchbar
            placeholder={ 'Enter Doctor\'s Name' }
            placeholderTextColor={ barColor }
            iconColor={ barColor }
            onChangeText={ val => setFilter(val) }
            style={ { elevation: 0, borderRadius: 0, borderBottomWidth: 1, borderColor: barColor } }
            inputStyle={ { color: barColor } }
            value={ filter }
          />
          {
            [
              {
                section: 'Pending',
                app: Pending.map(a => ({ ...a, medicalStaff: medicalStaff.find(ms => ms.id === a.medicalStaffId) }))
                  .filter(u => u.medicalStaff?.username.toLowerCase().includes(filter.toLowerCase()))
              },
              {
                section: 'Rejected',
                app: Rejected.map(a => ({ ...a, medicalStaff: medicalStaff.find(ms => ms.id === a.medicalStaffId) }))
                  .filter(u => u.medicalStaff?.username.toLowerCase().includes(filter.toLowerCase()))
              }
            ].filter(({ app }) => app.length > 0)
              .map(({ section, app }, index) =>
                <List.Section key={ 'Section-' + index } style={ { backgroundColor: Colors.surface } }>
                  <List.Subheader style={ [ styles.text, { textTransform: 'capitalize' } ] }>{ section }</List.Subheader>
                  {
                    app.map(a =>
                      <List.Item key={ 'PU-' + index }
                        style={ { backgroundColor: Colors.surface, marginBottom: 1 } }
                        title={ 'Appointment on ' + (a.type === 'byTime' ? a.time : a.date).toDateString() }
                        titleStyle={ [ styles.text, { textTransform: 'capitalize' } ] }
                        description={ a.medicalStaff?.username + '\n' + a.address }
                        descriptionStyle={ [ styles.text ] }
                        descriptionNumberOfLines={ 5 }
                        right={ props =>
                          <View style={ { justifyContent: 'center' } }>
                            <MaterialCommunityIcons { ...props } color={ barColor } name='details' size={ 24 } />
                          </View>
                        }
                        onPress={ () => setSelectedAppointment(a) }
                      />
                    )
                  }
                </List.Section>
              )
          }
        </List.Accordion>
        : <View style={ { alignItems: 'center' } }>
          <Text style={ { textAlignVertical: 'center' } }>{ `No appointment is scheduled.` }</Text>
        </View>
    )
  }

  function AppointmentDialog(props: AppointmentDialogProps) {
    const { appointment, onClose } = props
    const navigation = useNavigation()
    const [ show, setShow ] = useState(false)
    const [ ms, setMS ] = useState<MedicalStaff>()

    useEffect(() => {
      if (appointment) {
        setMS(medicalStaff.find(ms => ms.id === appointment.medicalStaffId))
        setShow(true)
      }
    }, [ props.appointment ])

    const reschedule = () =>
      Promise.all([
        ...appointment
          ? [
            AppointmentStore.setNewAppDetail({ medicalStaffId: appointment.medicalStaffId, address: appointment.address, type: 'byTime' }),
            AppointmentStore.setSelectedAppointment(appointment)
          ]
          : []
      ]
      ).then(() => {
        onClose()
        navigation.navigate('Appointment/SelectTimeslot')
      })

    const cancel = () =>
      appointment
        ? AppointmentStore.cancelAppointment(appointment.id, appointment.medicalStaffId)
          .then(() => onClose())
          .catch(err => console.log(err))
        : undefined

    return (
      show
        ? <View style={ dialogStyles.dialog }>
          <Modal
            backdropColor='rgba(211, 211, 211, 0.4)'
            isVisible={ appointment !== undefined }
            onModalHide={ () => setShow(false) }
            useNativeDriver
            onBackdropPress={ () => onClose() }
          >
            <View style={ dialogStyles.centeredView }>
              <View style={ dialogStyles.modalView }>
                <Title style={ { color: 'black' } }>{ 'Appointment Detail' }</Title>
                {
                  appointment
                    ? [
                      { field: 'Date', val: (appointment.type === 'byTime' ? appointment.time : appointment.date).toDateString() },
                      { field: 'Medical Staff', val: ms?.username },
                      { field: 'Address', val: appointment.address },
                      appointment.type === 'byTime'
                        ? { field: 'Time', val: DateUtil.hour12(appointment.time), isNormalText: true }
                        : appointment.type === 'byNumber'
                          ? { field: 'Turn Number', val: appointment.turn + 1, isNormalText: true }
                          : { field: undefined }
                    ].filter(({ field }) => !isUndefined(field))
                      .map(({ field, val, isNormalText }, index) =>
                        <View key={ 'bi-' + index } style={ { flexDirection: 'row', marginVertical: 10 } }>
                          <View style={ { flex: 2 } }>
                            <Text style={ styles.text }>{ field }:</Text>
                          </View>
                          <View style={ { flex: 3 } }>
                            <Text style={ [ styles.text, isNormalText ? {} : { textTransform: 'capitalize' } ] }>{ val }</Text>
                          </View>
                        </View>
                      )
                    : null
                }
                <Divider style={ { marginVertical: 5 } } />
                <View style={ styles.buttons }>
                  {
                    appointment?.type === 'byTime'
                      ? <Button onPress={ reschedule } mode='contained' style={ [ styles.button, { backgroundColor: 'blue' } ] } labelStyle={ { color: Colors.text } }>{ 'Reschedule Appointment' }</Button>
                      : undefined
                  }
                  <Button onPress={ cancel } labelStyle={ { color: 'red' } }>{ 'Cancel Appointment' }</Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        : null
    )
  }
}

export default withResubAutoSubscriptions(AppointmentPage)

interface AppointmentDialogProps {
  onClose: Function
  appointment: Appointment | undefined
}

const styles = StyleSheet.create({
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