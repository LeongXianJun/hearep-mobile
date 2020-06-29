import React, { FC, useEffect, useState } from 'react'
import { Snackbar } from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'

import AuthenticationDialog from './authenticationDialog'
import { AccessPermissionStore, NotificationStore } from '../stores'

interface ManagerProps {
  children?: React.ReactNode
}

const NotificationManager: FC<ManagerProps> = ({ children }) => {
  const isRequesting = AccessPermissionStore.getIsRequesting()
  const notifications = NotificationStore.getNotifications()

  const [ message, setMessage ] = useState<{ title: string, description: string }>({ title: '', description: '' })
  const [ snackVisible, setSnackVisible ] = useState(false)

  useEffect(() => {
    return NotificationStore.unsubscribeOnTokenRefresh
  }, [])

  useEffect(() => {
    notifications.forEach(n => {
      setMessage(n)
      setSnackVisible(true)
    })
  }, [ notifications ])

  return <>
    { children }
    <AuthenticationDialog visible={ isRequesting } onClose={ () => AccessPermissionStore.respondRequest('Rejected') } />
    <Snackbar
      visible={ snackVisible }
      duration={ Snackbar.DURATION_MEDIUM }
      onDismiss={ () => setSnackVisible(false) }
    >
      { message.title + '\n' + message.description }
    </Snackbar>
  </>
}

export default withResubAutoSubscriptions(NotificationManager)