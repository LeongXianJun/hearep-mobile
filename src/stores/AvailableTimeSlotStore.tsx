import qs from 'qs'
import UserStore from './UserStore'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AvailableTimeSlotStore extends StoreBase {
  private availableTimeSlots: AvailableTimeSlots | undefined
  private isReady: boolean

  constructor() {
    super()
    this.isReady = false
  }

  private getToken = () => UserStore.getToken()

  // get available timeslots
  fetchAvailableTimeslots = (medicalStaffId: string, date: Date) => this.getToken().then(async userToken => {
    if (userToken) {
      this.isReady = false
      this.trigger(AvailableTimeSlotStore.IsReadyKey)
      await fetch('http://10.0.2.2:8001/workingTime/get', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({ userToken, medicalStaffId, date })
      }).then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw response.status + ': (' + response.statusText + ')'
        }
      }).then(data => {
        if (data.errors) {
          throw data.errors
        } else {
          this.isReady = true
          this.availableTimeSlots = new AvailableTimeSlots(data)
          this.trigger([ AvailableTimeSlotStore.IsReadyKey, AvailableTimeSlotStore.AvailableTimeSlotsKey ])
        }
      }).catch(err => Promise.reject(new Error(err)))
    } else {
      Promise.reject(new Error('No Token Found'))
    }
  })

  static AvailableTimeSlotsKey = 'AvailableTimeSlotsKey'
  @autoSubscribeWithKey('AvailableTimeSlotsKey')
  getAvailableTimeSlots() {
    return this.availableTimeSlots
  }

  static IsReadyKey = 'IsReadyKey'
  @autoSubscribeWithKey('IsReadyKey')
  ready() {
    return this.isReady
  }
}

class AvailableTimeSlots {
  daySlots: {
    day: Date
    slots: Date[]
  }[]

  constructor(input: any) {
    this.daySlots = (input as Array<any>).map(ts => ({
      day: new Date(ts.day),
      slots: (ts.slots as Array<any>).map(s => new Date(s))
    }))
  }
}

export default new AvailableTimeSlotStore()