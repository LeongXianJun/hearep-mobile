class AppointmentConnection {
  public nearing: Appointment[] = [
    { id: 1, date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Dr Jone Leong', address: 'Orthopaedic Surgery, Pekeliling, 53000 Kuala Lumpur, Federal Territory of Kuala Lumpur', type: 'byTime', time: '1:30 pm' },
    { id: 2, date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Dr Carmen', address: 'No.11, Pekan Batu 14 Hulu Langat, 43100 Hulu Langat, Selangor', type: 'byTime', time: '2:30 pm' },
    { id: 3, date: new Date(Date.now() + 24 * 3600000), medicalStaff: 'Dr Jone Leong', address: 'Pt 21147, Persiaran SL 1, Bandar Sungai Long, 43200 Kajang, Selangor', type: 'byTime', time: '7:00 pm' },
  ]
  public appointmentDB: Appointment[] = [
    ...this.nearing,
    { id: 4, date: new Date(2020, 4, 26), medicalStaff: 'Dr Jane', address: 'No.11, Pekan Batu 14 Hulu Langat, 43100 Hulu Langat, Selangor', type: 'byTime', time: '1:30 pm' },
    { id: 5, date: new Date(2020, 4, 27), medicalStaff: 'Dr Quirz', address: 'Orthopaedic Surgery, Pekeliling, 53000 Kuala Lumpur, Federal Territory of Kuala Lumpur', type: 'byTime', time: '2:30 pm' },
    { id: 6, date: new Date(2020, 4, 28), medicalStaff: 'Dr Jone Leong', address: 'Jalan Cheras, Kampung Sungai Kantan, 43000 Kajang, Selangor', type: 'byTime', time: '7:00 pm' },
    { id: 7, date: new Date(2020, 4, 1), medicalStaff: 'Dr Jone Leong', address: 'Jalan Cheras, Kampung Sungai Kantan, 43000 Kajang, Selangor', type: 'byTime', time: '2:00 pm' },
    { id: 8, date: new Date(2020, 4, 16), medicalStaff: 'Dr Jane', address: 'Pt 21147, Persiaran SL 1, Bandar Sungai Long, 43200 Kajang, Selangor', type: 'byTime', time: '10:00 am' },
    { id: 9, date: new Date(2020, 4, 20), medicalStaff: 'Dr Alan', address: 'Orthopaedic Surgery, Pekeliling, 53000 Kuala Lumpur, Federal Territory of Kuala Lumpur', type: 'byTime', time: '10:00 am' },
    { id: 10, date: new Date(2020, 5, 27), medicalStaff: 'Dr Jone Leong', address: 'Pt 21147, Persiaran SL 1, Bandar Sungai Long, 43200 Kajang, Selangor', type: 'byTime', time: '10:00 am' },
    { id: 11, date: new Date(2020, 5, 28), medicalStaff: 'Dr Alan', address: 'Jalan Cheras, Kampung Sungai Kantan, 43000 Kajang, Selangor', type: 'byNumber', turn: 5 }
  ]
  public oldDB: Appointment[] = [
    { id: 12, date: new Date(2020, 4, 26), medicalStaff: 'Dr Jane', address: 'No.11, Pekan Batu 14 Hulu Langat, 43100 Hulu Langat, Selangor', type: 'byTime', time: '1:30 pm' },
    { id: 13, date: new Date(2020, 4, 27), medicalStaff: 'Dr Quirz', address: 'Orthopaedic Surgery, Pekeliling, 53000 Kuala Lumpur, Federal Territory of Kuala Lumpur', type: 'byTime', time: '2:30 pm' },
    { id: 14, date: new Date(2020, 4, 28), medicalStaff: 'Dr Jone Leong', address: 'No.11, Pekan Batu 14 Hulu Langat, 43100 Hulu Langat, Selangor', type: 'byTime', time: '7:00 pm' },
    { id: 15, date: new Date(2020, 4, 1), medicalStaff: 'Dr Jone Leong', address: 'Pt 21147, Persiaran SL 1, Bandar Sungai Long, 43200 Kajang, Selangor', type: 'byTime', time: '2:00 pm' },
    { id: 16, date: new Date(2020, 4, 16), medicalStaff: 'Dr Jane', address: 'Orthopaedic Surgery, Pekeliling, 53000 Kuala Lumpur, Federal Territory of Kuala Lumpur', type: 'byTime', time: '10:00 am' },
    { id: 17, date: new Date(2020, 4, 20), medicalStaff: 'Dr Alan', address: 'Jalan Cheras, Kampung Sungai Kantan, 43000 Kajang, Selangor', type: 'byTime', time: '10:00 am' },
    { id: 18, date: new Date(2020, 5, 27), medicalStaff: 'Dr Jone Leong', address: 'Orthopaedic Surgery, Pekeliling, 53000 Kuala Lumpur, Federal Territory of Kuala Lumpur', type: 'byTime', time: '10:00 am' },
    { id: 19, date: new Date(2020, 5, 28), medicalStaff: 'Dr Alan', address: 'Jalan Cheras, Kampung Sungai Kantan, 43000 Kajang, Selangor', type: 'byNumber', turn: 5 }
  ]

  public workingTimes: WorkingTime[] = [
    {
      id: 1, medicalStaffID: 1, type: 'byTime',
      timeslots: [
        { day: 'Sunday', slots: [ 1, 3, 5, 7, 9 ] },
        { day: 'Monday', slots: [ 2, 3, 4, 5 ] },
        { day: 'Tuesday', slots: [ 6, 7, 8 ] },
        { day: 'Wednesday', slots: [ 1, 2, 3, 6, 7, 8 ] },
        { day: 'Thursday', slots: [ 1, 3, 5, 7, 8, 10 ] },
        { day: 'Friday', slots: [ 1, 3, 5, 7, 8, 10 ] },
        { day: 'Saturday', slots: [ 1, 3, 5, 7, 9 ] }
      ]
    },
    {
      id: 2, medicalStaffID: 2, type: 'byNumber',
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

  newAppointment: newA = {
    date: new Date(),
    medicalStaff: '',
    address: '',
    time: '',
    turn: 0
  }

  setNewAppointmentDetail = (field: keyof newA, input: Date | string | number) =>
    this.newAppointment = { ...this.newAppointment, [ field ]: input }

  createNewAppointment = () => {
    this.newAppointment = {
      date: new Date(),
      medicalStaff: '',
      address: ''
    }
    // this.appointmentDB = [
    //   ...this.appointmentDB,
    //   { 
    //     id: this.appointmentDB.length, type: this.newAppointment.time? 'byTime': 'byNumber', ...this.newAppointment
    //   }
    // ]
  }

  public getAppointment = (id: string) => this.appointmentDB.find(a => a.id.toString() === id)
  public cancelAppointment = (remA: Appointment) => this.appointmentDB = this.appointmentDB.filter(({ id }) => id !== remA.id)
  public getWorkingTime = (id: string) => this.workingTimes.find(w => w.medicalStaffID.toString() === id)
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
  medicalStaffID: number
} & (
    {
      type: 'byTime'
      timeslots: TimeslotByTime[]
    } | {
      type: 'byNumber'
      timeslots: TimeslotByNum[]
    }
  )

export type TimeslotByTime = {
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  slots: number[]
}

export type TimeslotByNum = {
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  startTime: string
  endTime: string
}

export const isByTime = (r: Appointment): r is ByTimeAppointment => {
  return r.type === 'byTime'
}


export const isByNumber = (r: Appointment): r is ByNumberAppointment => {
  return r.type === 'byNumber'
}


type newA = {
  date?: Date
  medicalStaff?: string
  address?: string
  time?: string
  turn?: number
}