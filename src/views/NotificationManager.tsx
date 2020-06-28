import React, { FC, useEffect, useState } from 'react'
import { Snackbar } from 'react-native-paper'
import { withResubAutoSubscriptions } from 'resub'

import { NotificationStore } from '../stores'

interface ManagerProps {
  children?: React.ReactNode
}

const NotificationManager: FC<ManagerProps> = ({ children }) => {
  const notifications = NotificationStore.getNotifications()

  const [ message, setMessage ] = useState('')
  const [ snackVisible, setSnackVisible ] = useState(false)

  useEffect(() => {
    return NotificationStore.unsubscribeOnTokenRefresh
  }, [])

  useEffect(() => {
    notifications.forEach(n => {
      setMessage(n.title)
      setSnackVisible(true)
    })
  }, [ notifications ])

  return <>
    { children }
    <Snackbar
      visible={ snackVisible }
      duration={ Snackbar.DURATION_MEDIUM }
      onDismiss={ () => setSnackVisible(false) }
    >
      { message }
    </Snackbar>
  </>
}

export default withResubAutoSubscriptions(NotificationManager)