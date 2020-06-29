import React, { useState, useEffect, FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Title, Button, Paragraph, Divider } from 'react-native-paper'
import Modal from 'react-native-modal'

import { Colors } from '../styles'
import { AccessPermissionStore } from '../stores'

interface AuthenticationDialogProps {
  visible: boolean
  onClose: Function
}

const AuthenticationDialog: FC<AuthenticationDialogProps> = ({ visible, onClose }) => {
  const [ isVisible, setIsVisible ] = useState(false)
  const [ show, setShow ] = useState(false)

  useEffect(() => {
    setIsVisible(visible)
    if (visible) {
      setShow(true)
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
                <Paragraph style={ { color: 'black' } }>{ 'Medical staff, Dr Jone want to acceess your health record. Do you authorize him to view your records?' }</Paragraph>
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

export default AuthenticationDialog

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