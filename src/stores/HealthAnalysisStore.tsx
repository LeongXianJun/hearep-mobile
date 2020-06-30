import qs from 'qs'
import UserStore from './UserStore'
import { DateUtil, getURL } from '../utils'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class HealthAnalysisStore extends StoreBase {
  isReady: boolean
  options: string[]
  healthCondition: {
    'Sickness Frequency': { month: Date, count: number }[],
    'Blood Sugar Level': { day: Date, count: number, length: number }[],
    'Blood Pressure Level': { day: Date, count: number, length: number }[],
    'BMI': { day: Date, count: number, length: number }[],
  }
  constructor() {
    super()
    this.isReady = false
    this.options = []
    this.healthCondition = {
      'Sickness Frequency': [],
      'Blood Sugar Level': [],
      'Blood Pressure Level': [],
      'BMI': [],
    }
  }

  private getToken = () => UserStore.getToken()

  fetchHealthAnalysis = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/analysis/patient', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, date: new Date() })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(data => {
          if (data.errors) {
            this.isReady = false
            this.trigger([ HealthAnalysisStore.HCReadyKey ])
            throw new Error(data.errors)
          } else {
            this.isReady = true
            this.healthCondition = {
              'Sickness Frequency': data[ 'Sickness Frequency' ].map((d: any) => ({ month: new Date(d.month), count: d.count })),
              'Blood Sugar Level': data[ 'Blood Sugar Level' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length })),
              'Blood Pressure Level': data[ 'Blood Pressure Level' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length })),
              'BMI': data[ 'BMI' ].map((d: any) => ({ day: new Date(d.day), count: d.count, length: d.length }))
            }
            this.trigger([ HealthAnalysisStore.HealthConditionKey, HealthAnalysisStore.HCReadyKey ])
          }
        }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  fetchOptions = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/healthCondition/option', {
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
            this.options = data
            this.trigger(HealthAnalysisStore.HealthConditionOptionKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
      } else {
        throw new Error('No Token Found')
      }
    })

  insertHealthCondition = (healthCondition: HealthCondition) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/healthCondition/update', {
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
            this.trigger([ HealthAnalysisStore.HealthConditionKey, HealthAnalysisStore.HCReadyKey ])
          }
        }).catch(err => Promise.reject(new Error('Fetch Analysis: ' + err.message)))
      } else {
        throw new Error('No Token Found')
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


export default new HealthAnalysisStore()