import qs from 'qs'
import { AsyncStorage } from 'react-native'
import messaging from '@react-native-firebase/messaging'

import { getURL } from '../utils'
import UserStore from './UserStore'
import AccessPermissionStore from './AccessPermissionStore'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class NotificationStore extends StoreBase {
  notification: { title: string, description: string }[]
  constructor() {
    super()
    this.notification = []
  }

  private getToken = () => UserStore.getToken()
  messaging = messaging()

  unsubscribeOnTokenRefresh = this.messaging.onTokenRefresh(() => {
    this.setTokenSentToServer(false)
    this.messaging.getToken().then(refreshedToken => {
      this.notification = []
      this.sendTokenToServer(refreshedToken)
      this.trigger(NotificationStore.NotificationsKey)
    }).catch(err =>
      console.log('Unable to retrieve refreshed token ', err)
    )
  })

  unsubscribeOnMessage = this.messaging.onMessage(async remoteMessage => {
    const { data } = remoteMessage
    if (data) {
      if (data.medicalStaffId) {
        AccessPermissionStore.setIsRequesting(data.medicalStaffId, true)
      } else {
        this.notification = [
          { title: data.title, description: data.description }
        ]
        this.trigger(NotificationStore.NotificationsKey)
      }
    }
  })

  unsubscribeBackgroundHandler = this.messaging.setBackgroundMessageHandler(async remoteMessage => {
  })

  sendTokenToServer = (currentToken: string) =>
    AsyncStorage.getItem('sentToServer')
      .then(result => {
        if (result !== '1') {
          this.getToken().then(async userToken => {
            if (userToken) {
              await fetch(getURL() + '/user/device', {
                method: 'PUT',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: qs.stringify({ userToken, deviceToken: currentToken })
              }).then(response => {
                if (response.ok) {
                  return response.json()
                } else {
                  throw new Error(response.status + ': (' + response.statusText + ')')
                }
              }).then(result => {
                if (result.errors) {
                  throw new Error(result.errors)
                } else {
                  this.setTokenSentToServer(true)
                }
              })
                .catch(err => Promise.reject(new Error(err.message)))
            } else {
              throw new Error('No Token Found')
            }
          })
        }
      })

  setTokenSentToServer = (sent: boolean) =>
    AsyncStorage.setItem('sentToServer', sent ? '1' : '0')

  static NotificationsKey = 'NotificationsKey'
  @autoSubscribeWithKey('NotificationsKey')
  getNotifications() {
    return this.notification
  }
}

export default new NotificationStore()