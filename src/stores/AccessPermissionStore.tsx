import qs from 'qs'
import UserStore from './UserStore'
import { getURL } from '../utils/Common'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AccessPermissionStore extends StoreBase {
  medicalStaffId: string
  isRequesting: boolean
  isEmergency: boolean
  targetId: string
  constructor() {
    super()
    this.medicalStaffId = ''
    this.isRequesting = false
    this.isEmergency = false
    this.targetId = ''
  }

  private getToken = () => UserStore.getToken()

  // get available timeslots
  respondRequest = (status: 'Permitted' | 'Rejected') => this.getToken().then(async userToken => {
    if (userToken) {
      return await fetch(getURL() + '/access/respond', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({ userToken, medicalStaffId: this.medicalStaffId, status })
      }).then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(response.status + ': (' + response.statusText + ')')
        }
      }).then(data => {
        if (data.errors) {
          throw new Error(data.errors)
        } else {
          if (data.response.includes('Send Successfully')) {
            this.setIsRequesting('', '', false, false)
            return data.response
          } else {
            throw new Error('Weird Error')
          }
        }
      }).catch(err => Promise.reject(new Error('Access Request: ' + err.message)))
    } else {
      throw new Error('No Token Found')
    }
  })

  static isRequestingKey = 'isRequestingKey'
  @autoSubscribeWithKey('isRequestingKey')
  getIsRequesting() {
    return this.isRequesting
  }

  static requestInfoKey = 'requestInfoKey'
  @autoSubscribeWithKey('requestInfoKey')
  getRequestInfo() {
    return {
      medicalStaffId: this.medicalStaffId,
      targetId: this.targetId,
      isEmergency: this.isEmergency
    }
  }

  setIsRequesting(medicalStaffId: string, targetId: string, isEmergency: boolean, isRequesting: boolean) {
    this.medicalStaffId = medicalStaffId
    this.targetId = targetId
    this.isEmergency = isEmergency
    this.isRequesting = isRequesting
    this.trigger([ AccessPermissionStore.isRequestingKey, AccessPermissionStore.requestInfoKey ])
  }
}

export default new AccessPermissionStore()