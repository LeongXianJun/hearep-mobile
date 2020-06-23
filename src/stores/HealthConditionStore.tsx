import qs from 'qs'
import { UserStore } from '.'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'
import { DateUtil } from '../utils'

@AutoSubscribeStore
class HealthConditionStore extends StoreBase {
  isReady: boolean
  options: string[]
  healthCondition: {
    'Blood Sugar Level': { day: Date, count: number, length: number }[],
    'Blood Pressure Level': { day: Date, count: number, length: number }[],
    'BMI': { day: Date, count: number, length: number }[],
  }
  constructor() {
    super()
    this.isReady = false
    this.options = []
    this.healthCondition = {
      'Blood Sugar Level': [],
      'Blood Pressure Level': [],
      'BMI': [],
    }
  }

  private getToken = () => UserStore.getToken()

  fetchHealthCondition = (patientId: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        if (userToken) {
          await fetch('http://10.0.2.2:8001/healthCondition/get', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({ userToken, date: new Date(), patientId })
          }).then(response => {
            if (response.ok) {
              return response.json()
            } else {
              throw new Error(response.status + ': (' + response.statusText + ')')
            }
          }).then(data => {
            if (data.errors) {
              this.isReady = false
              this.trigger([ HealthConditionStore.HCReadyKey ])
              throw new Error(data.errors)
            } else {
              this.isReady = true
              this.healthCondition = {
                'Blood Sugar Level': data[ 'Blood Sugar Level' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length })),
                'Blood Pressure Level': data[ 'Blood Pressure Level' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length })),
                'BMI': data[ 'BMI' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length }))
              }
              this.trigger([ HealthConditionStore.HealthConditionKey, HealthConditionStore.HCReadyKey ])
            }
          }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
        } else {
          throw new Error('No Token Found')
        }
      }
    })

  getOption = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        if (userToken) {
          await fetch('http://10.0.2.2:8001/healthCondition/option', {
            method: 'POST',
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
          }).then(data => {
            if (data.errors) {
              throw new Error(data.errors)
            } else {
              this.options = data.options
              this.trigger(HealthConditionStore.HealthConditionOptionKey)
            }
          }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
        } else {
          throw new Error('No Token Found')
        }
      }
    })

  insertHealthCondition = (healthCondition: HealthCondition) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        if (userToken) {
          await fetch('http://10.0.2.2:8001/healthCondition/update', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({ userToken, healthCondition })
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
              this.healthCondition = {
                ...this.healthCondition,
                [ healthCondition.option ]: [
                  ...this.healthCondition[ healthCondition.option as 'Blood Sugar Level' | 'Blood Pressure Level' | 'BMI' ].map(a => DateUtil.isSameDay(a.day, healthCondition.date) ? { ...a, count: a.count + healthCondition.value, length: a.length + 1 } : a)
                ]
              }
              this.trigger([ HealthConditionStore.HealthConditionKey, HealthConditionStore.HCReadyKey ])
            }
          }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
        } else {
          throw new Error('No Token Found')
        }
      }
    })

  static HealthConditionOptionKey = 'HealthConditionOptionKey'
  @autoSubscribeWithKey('HealthConditionOptionKey')
  getHealthConditionOptions() {
    return this.options
  }

  static HealthConditionKey = 'HealthConditionKey'
  @autoSubscribeWithKey('HealthConditionKey')
  getHealthCondition() {
    return this.healthCondition
  }

  static HCReadyKey = 'HCReadyKey'
  @autoSubscribeWithKey('HCReadyKey')
  ready() {
    return this.isReady
  }
}

export type HealthCondition = {
  date: Date
  option: string
  value: number
}


export default new HealthConditionStore()