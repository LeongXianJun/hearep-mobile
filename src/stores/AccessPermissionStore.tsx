import qs from 'qs'
import UserStore from './UserStore'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AccessPermissionStore extends StoreBase {
  medicalStaffId: string
  isRequesting: boolean
  constructor() {
    super()
    this.medicalStaffId = ''
    this.isRequesting = false
  }

  private getToken = () => UserStore.getToken()

  // get available timeslots
  respondRequest = (status: 'Permitted' | 'Rejected') => this.getToken().then(async userToken => {
    if (userToken) {
      return await fetch('http://10.0.2.2:8001/access/respond', {
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
            this.setIsRequesting('', false)
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

  setIsRequesting(medicalStaffId: string, isRequesting: boolean) {
    this.medicalStaffId = medicalStaffId
    this.isRequesting = isRequesting
    this.trigger(AccessPermissionStore.isRequestingKey)
  }
}

export default new AccessPermissionStore()