import React, { useState, useEffect, FC } from 'react'
import { StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal'
import { withResubAutoSubscriptions } from 'resub'
import { Title, Button, Paragraph, Divider } from 'react-native-paper'

import { Colors } from '../styles'
import { AccessPermissionStore, UserStore, MedicalStaff, Patient } from '../stores'

interface AuthenticationDialogProps {
  visible: boolean
  onClose: Function
}

const AuthenticationDialog: FC<AuthenticationDialogProps> = ({ visible, onClose }) => {
  const medicalStaff = UserStore.getMedicalStaff()
  const patients = UserStore.getPatients()
  const allPatients = [ ...patients.authorized, ...patients.notAuthorized ]
  const requestInfo = AccessPermissionStore.getRequestInfo()

  const [ ms, setMS ] = useState<MedicalStaff>()
  const [ p, setP ] = useState<Patient>()
  const [ show, setShow ] = useState(false)
  const [ isVisible, setIsVisible ] = useState(false)

  useEffect(() => {
    UserStore.fetchAllMedicalStaff()
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    setIsVisible(visible)
    if (visible) {
      setShow(true)
      setMS(medicalStaff.find(ms => ms.id === requestInfo.medicalStaffId))
      setP(allPatients.find(p => p.id === requestInfo.targetId))
    }
  }, [ visible ])

  const hideDialog = () => onClose()
  const permit = () => AccessPermissionStore.respondRequest('Permitted')
    .then(response => {
      if (response.includes('Send Successfully') === false) {
        hideDialog()
      }
    })

  return (
    show
      ? <View style={ styles.dialog }>
        <Modal
          backdropColor='rgba(211, 211, 211, 0.4)'
          isVisible={ isVisible }
          onModalHide={ () => setShow(false) }
          useNativeDriver
          onBackdropPress={ hideDialog }
        >
          <View style={ styles.centeredView }>
            <View style={ styles.modalView }>
              <View>
                <Title style={ { color: 'black' } }>Authorize the Access to Your Health Records</Title>
                <Paragraph style={ { color: 'black' } }>{ `Medical staff, Dr ${ms?.username} want to acceess your health record. Do you authorize him/her to view ${requestInfo.isEmergency === true ? p?.username + "\'s" : 'your'} records?` }</Paragraph>
              </View>
              <Divider style={ { marginVertical: 5 } } />
              <View style={ { flexDirection: 'row', justifyContent: 'flex-end' } }>
                <Button onPress={ hideDialog } mode='contained' style={ [ styles.button, { backgroundColor: 'red' } ] } labelStyle={ { color: Colors.text } }>Reject</Button>
                <Button onPress={ permit } mode='contained' style={ [ styles.button, { backgroundColor: 'green' } ] } labelStyle={ { color: Colors.text } }>Permit</Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      : null
  )
}

export default withResubAutoSubscriptions(AuthenticationDialog)

const styles = StyleSheet.create({
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
    backgroundColor: "white",
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
  button: {
    marginHorizontal: 5,
    borderRadius: 5,
  }
})