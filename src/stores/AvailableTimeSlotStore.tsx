import qs from 'qs'
import UserStore from './UserStore'
import { getURL } from '../utils/Common'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AvailableTimeSlotStore extends StoreBase {
  private availableTimeSlots: AvailableTimeSlots | undefined

  constructor() {
    super()
  }

  private getToken = () => UserStore.getToken()

  // get available timeslots
  fetchAvailableTimeslots = (medicalStaffId: string, date: Date) => this.getToken().then(async userToken => {
    if (userToken) {
      await fetch(getURL() + '/workingTime/get', {
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
          this.availableTimeSlots = new AvailableTimeSlots(data)
          this.trigger(AvailableTimeSlotStore.AvailableTimeSlotsKey)
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