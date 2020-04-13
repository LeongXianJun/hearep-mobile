class AppointmentConnection {
  public nearing: Appointment[] = [
    { id: 1, date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '1:30 pm' },
    { id: 2, date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '2:30 pm' },
    { id: 3, date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '7:00 pm' },
  ]
  public appointmentDB: Appointment[] = [
    ...this.nearing,
    { id: 4, date: new Date('2020-4-27'), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '1:30 pm' },
    { id: 5, date: new Date('2020-4-27'), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '2:30 pm' },
    { id: 6, date: new Date('2020-4-27'), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '7:00 pm' },
    { id: 7, date: new Date('2020-4-1'), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '2:00 pm' },
    { id: 8, date: new Date('2020-4-16'), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '10:00 am' },
    { id: 9, date: new Date('2020-4-20'), medicalStaff: 'Dr Alan', address: 'Leong Hospital', type: 'byTime', time: '10:00 am' },
    { id: 10, date: new Date('2020-4-24'), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byTime', time: '10:00 am' },
    { id: 11, date: new Date('2020-4-28'), medicalStaff: 'Dr Jone Leong', address: 'Leong Hospital', type: 'byNumber', turn: 5 }
  ]

  public workingTimes: WorkingTime[] = [
    { 
      id: 1, medicalStaff: 'Dr Jone Leong', type: 'byTime', 
      timeslots: [
        { day: 'Sunday', slots: [1, 3, 5, 7, 9] },
        { day: 'Monday', slots: [2, 3, 4, 5] },
        { day: 'Tuesday', slots: [6, 7, 8] },
        { day: 'Wednesday', slots: [1, 2, 3, 6, 7, 8] },
        { day: 'Thursday', slots: [1, 3, 5, 7, 8, 10] },
        { day: 'Friday', slots: [1, 3, 5, 7, 8, 10] },
        { day: 'Saturday', slots: [1, 3, 5, 7, 9] }
      ]
    },
    { 
      id: 2, medicalStaff: 'Dr Jane', type: 'byNumber', 
      timeslots: [
        { day: 'Sunday', startTime: '10am', endTime: '3pm' },
        { day: 'Monday', startTime: '9am', endTime: '5pm' },
        { day: 'Tuesday', startTime: '9am', endTime: '5pm' },
        { day: 'Wednesday', startTime: '9am', endTime: '5pm' },
        { day: 'Thursday', startTime: '9am', endTime: '5pm' },
        { day: 'Friday', startTime: '9am', endTime: '5pm' },
        { day: 'Saturday', startTime: '10am', endTime: '8pm' }
      ]
    }
  ]

  public getAppointment = (id: number) => this.appointmentDB.find(a => a.id === id)
}

export default new AppointmentConnection()

export type Appointment = ByTimeAppointment | ByNumberAppointment

type ADetail = {
  id: number
  date: Date
  medicalStaff: string
  address: string // need because the doctor may transfer to another. Some may work in multiple location
}

export type ByTimeAppointment = ADetail & {
  type: 'byTime'
  time: string
}

export type ByNumberAppointment = ADetail & {
  type: 'byNumber'
  turn: number
}

export const FixedTime = [
  '8am',
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
]

export type WorkingTime = {
  id: number
  medicalStaff: string
} & (
  {
    type: 'byTime'
    timeslots: {
      day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
      slots: number[]
    }[]
  } | {
    type: 'byNumber'
    timeslots: {
      day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
      startTime: string
      endTime: string
    }[]
  }
)

export const isByTime = (r: Appointment): r is ByTimeAppointment => {
  return r.type === 'byTime'
}


export const isByNumber = (r: Appointment): r is ByNumberAppointment => {
  return r.type === 'byNumber'
}
