import qs from 'qs'
import messaging from '@react-native-firebase/messaging'

import UserStore from './UserStore'
import { getURL } from '../utils/Common'
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
        AccessPermissionStore.setIsRequesting(data.medicalStaffId, data.patientId, data.isEmergency as any, true)
      } else {
        this.notification = [
          { title: data.title, description: data.description }
        ]
        this.trigger(NotificationStore.NotificationsKey)
      }
    } else {
      console.log(remoteMessage)
    }
  })

  unsubscribeBackgroundHandler = this.messaging.setBackgroundMessageHandler(async remoteMessage => {
  })

  sendTokenToServer = (currentToken: string) =>
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
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  removeToken = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/user/device/remove', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          }
        })
          .catch(err => Promise.reject(new Error(err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  static NotificationsKey = 'NotificationsKey'
  @autoSubscribeWithKey('NotificationsKey')
  getNotifications() {
    return this.notification
  }
}

export default new NotificationStore()