import qs from 'qs'
import UserStore from './UserStore'
import { getURL } from '../utils/Common'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class AppointmentStore extends StoreBase {
  private groupedAppointments: {
    'Pending': Appointment[],
    'Accepted': Appointment[],
    'Rejected': Appointment[],
    'Waiting': Appointment[],
    'Completed': Appointment[],
    'Cancelled': Appointment[]
  }
  private selectedAppointment: Appointment | undefined
  private newAppDetail: {
    medicalStaffId?: string,
    type?: 'byTime' | 'byNumber',
    address?: string,
    time?: Date,
    turn?: number
  }
  private byNumberDetail: {
    startTime: Date
    endTime: Date
    turn: number
  } | undefined

  constructor() {
    super()
    this.groupedAppointments = {
      'Pending': [],
      'Accepted': [],
      'Rejected': [],
      'Waiting': [],
      'Completed': [],
      'Cancelled': []
    }
    this.newAppDetail = {}
  }

  private getToken = () => UserStore.getToken()

  // get all appointments
  fetchAllAppointments = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/appointment/patient', {
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
            throw response.status + ': (' + response.statusText + ')'
          }
        }).then(data => {
          if (data.errors) {
            this.groupedAppointments = {
              'Pending': [],
              'Accepted': [],
              'Rejected': [],
              'Waiting': [],
              'Completed': [],
              'Cancelled': []
            }
            this.trigger(AppointmentStore.GroupedAppointmentsKey)
            throw data.errors
          } else {
            const createAppointment = (app: any) =>
              app.type === 'byTime'
                ? new ByTimeApp(app)
                : new ByNumberApp(app)
            this.groupedAppointments = {
              'Pending': data[ 'Pending' ].map(createAppointment),
              'Accepted': data[ 'Accepted' ].map(createAppointment),
              'Rejected': data[ 'Rejected' ].map(createAppointment),
              'Waiting': data[ 'Waiting' ].map(createAppointment),
              'Completed': data[ 'Completed' ].map(createAppointment),
              'Cancelled': data[ 'Cancelled' ].map(createAppointment)
            }
            this.trigger(AppointmentStore.GroupedAppointmentsKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Appointments: ' + err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  // get turn
  getTurn = (medicalStaffId: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/appointment/turn', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, medicalStaffId, date: new Date() })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw response.status + ': (' + response.statusText + ')'
          }
        }).then(data => {
          if (data.errors) {
            this.byNumberDetail = undefined
            this.trigger(AppointmentStore.ByNumberDetailKey)
            throw data.errors
          } else {
            this.byNumberDetail = {
              startTime: new Date(data[ 'startTime' ]),
              endTime: new Date(data[ 'endTime' ]),
              turn: data[ 'turn' ]
            }
            this.trigger(AppointmentStore.ByNumberDetailKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Turn: ' + err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  // insert appointment
  insertAppointment = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/appointment/insert', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            appointment: {
              ...this.newAppDetail,
              date: new Date()
            }
          })
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
            if (this.newAppDetail.type === 'byTime')
              this.groupedAppointments = {
                ...this.groupedAppointments,
                Pending: [
                  ...this.groupedAppointments.Waiting, new ByTimeApp({ id: data.docId, date: new Date(), ...this.newAppDetail })
                ]
              }
            else if (this.newAppDetail.type === 'byNumber')
              this.groupedAppointments = {
                ...this.groupedAppointments,
                Waiting: [
                  ...this.groupedAppointments.Waiting, new ByNumberApp({ id: data.docId, ...this.newAppDetail })
                ]
              }
            this.trigger(AppointmentStore.GroupedAppointmentsKey)
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  // reschedule appointment
  rescheduleAppointment = (oldAppId: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/appointment/reschedule', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            oldAppId,
            newApp: {
              ...this.newAppDetail,
              date: new Date()
            }
          })
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
            if (this.selectedAppointment) {
              if (this.newAppDetail.type === 'byTime')
                this.groupedAppointments = {
                  ...this.groupedAppointments,
                  [ this.selectedAppointment.status ]: [
                    ...this.groupedAppointments[ this.selectedAppointment.status ].filter(({ id }) => id !== this.selectedAppointment?.id)
                  ],
                  Pending: [
                    ...this.groupedAppointments.Waiting, new ByTimeApp({ id: data.docId, date: new Date(), status: 'Pending', ...this.newAppDetail })
                  ]
                }
              else if (this.newAppDetail.type === 'byNumber')
                this.groupedAppointments = {
                  ...this.groupedAppointments,
                  [ this.selectedAppointment.status ]: [
                    ...this.groupedAppointments[ this.selectedAppointment.status ].filter(({ id }) => id !== this.selectedAppointment?.id)
                  ],
                  Waiting: [
                    ...this.groupedAppointments.Waiting, new ByNumberApp({ id: data.docId, date: new Date(), status: 'Waiting', ...this.newAppDetail })
                  ]
                }
              this.trigger(AppointmentStore.GroupedAppointmentsKey)
            }
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  // cancel appointments
  cancelAppointment = (appId: string, medicalStaffId: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/appointment/cancel', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, appId, medicalStaffId })
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
            if (this.selectedAppointment) {
              this.groupedAppointments = {
                ...this.groupedAppointments,
                [ this.selectedAppointment.status ]: [
                  ...this.groupedAppointments[ this.selectedAppointment.status ].filter(({ id }) => id !== this.selectedAppointment?.id)
                ]
              }
              this.trigger(AppointmentStore.GroupedAppointmentsKey)
            }
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  static GroupedAppointmentsKey = 'GroupedAppointmentsKey'
  @autoSubscribeWithKey('GroupedAppointmentsKey')
  getGroupedAppointments() {
    return this.groupedAppointments
  }

  static SelectedAppointmentKey = 'SelectedAppointmentKey'
  @autoSubscribeWithKey('SelectedAppointmentKey')
  getSelectedAppointment() {
    return this.selectedAppointment
  }

  static ByNumberDetailKey = 'ByNumberDetailKey'
  @autoSubscribeWithKey('ByNumberDetailKey')
  getByNumberDetail() {
    return this.byNumberDetail
  }

  static newAppDetailKey = 'newAppDetailKey'
  @autoSubscribeWithKey('newAppDetailKey')
  getNewAppDetail() {
    return this.newAppDetail
  }

  setSelectedAppointment(app: Appointment) {
    this.selectedAppointment = app
  }

  setNewAppDetail(input: { medicalStaffId?: string, type?: 'byTime' | 'byNumber', address?: string, time?: Date, turn?: number }) {
    this.newAppDetail = {
      ...this.newAppDetail,
      ...input.medicalStaffId
        ? {
          medicalStaffId: input.medicalStaffId
        }
        : {},
      ...input.type
        ? {
          type: input.type
        }
        : {},
      ...input.address
        ? {
          address: input.address
        }
        : {},
      ...input.time
        ? {
          time: input.time
        }
        : {},
      ...input.turn !== undefined
        ? {
          turn: input.turn
        }
        : {},
    }
    this.trigger(AppointmentStore.newAppDetailKey)
  }
}

class ByTimeApp {
  id: string
  medicalStaffId: string
  date: Date
  address: string
  type: 'byTime' = 'byTime'
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled'
  time: Date

  constructor(input: any) {
    const { id, medicalStaffId, date, address, status, time } = input
    this.id = id
    this.medicalStaffId = medicalStaffId
    this.date = new Date(date)
    this.address = address
    this.status = status
    this.time = new Date(time)
  }
}

class ByNumberApp {
  id: string
  medicalStaffId: string
  date: Date
  address: string
  type: 'byNumber' = 'byNumber'
  status: 'Waiting' | 'Completed' | 'Cancelled'
  turn: number

  constructor(input: any) {
    const { id, medicalStaffId, date, address, status, turn } = input
    this.id = id
    this.medicalStaffId = medicalStaffId
    this.date = new Date(date)
    this.address = address
    this.status = status
    this.turn = turn
  }
}

export {
  ByTimeApp,
  ByNumberApp
}
export type Appointment = ByTimeApp | ByNumberApp
export default new AppointmentStore()