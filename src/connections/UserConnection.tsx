class UserConnection {
  currentUser: User = { 
    fullname: 'Leong Xian Jun', dob: new Date(1999, 0, 16), gender: 'M', occupation: 'student',
    contacts: [
      { type: 'email', value: 'joneleong@gmail.com' }, 
      { type: 'phone', value: '+60-165663878' }
    ]
  }

  isLogin = () => this.currentUser !== undefined

  login = () => {
    this.currentUser = { 
      fullname: 'Leong Xian Jun', dob: new Date(1999, 0, 16), gender: 'M', occupation: 'student',
      contacts: [
        { type: 'email', value: 'joneleong@gmail.com' }, 
        { type: 'phone', value: '+60-165663878' }
      ]
    }
  }

  medicalStaffDB: MedicalStaff[] = [
    { 
      id: 1, fullname: 'Jone Leong', dob: new Date(1999, 0, 16), gender: 'M', 
      contacts: [
        { type: 'email', value: 'joneleong@gmail.com' }, 
        { type: 'phone', value: '+60-165663878' }
      ],
      medicalInstituition: {
        role: 'Doctor',
        name: 'Leong Hospital',
        address: '40, Jalan Berjaya, Sungai Chua, 43000 Kajang, Selangor',
        department: 'Common Illness'
      }
    }, { 
      id: 2, fullname: 'Jane', dob: new Date(1980, 2, 15), gender: 'F', 
      contacts: [
        { type: 'email', value: 'jane@gmail.com' }, 
        { type: 'phone', value: '+60-123456789' }
      ],
      medicalInstituition: {
        role: 'Doctor',
        name: 'Leong Hospital',
        address: '40, Jalan Berjaya, Sungai Chua, 43000 Kajang, Selangor',
        department: 'Specialist'
      }
    }
  ]

  users: { id: number, name: string }[] = [
    { id: 1, name: 'Apple Lu' },
    { id: 2, name: 'Beele' },
    { id: 3, name: 'Catherine' },
    { id: 4, name: 'Dora' },
    { id: 5, name: 'Elaine' },
    { id: 6, name: 'Furry Lee' },
    { id: 7, name: 'Gigi' },
    { id: 8, name: 'Higo' },
    { id: 9, name: 'Iuros' },
    { id: 10, name: 'Jone' },
    { id: 11, name: 'Klues' },
    { id: 12, name: 'Line' },
    { id: 13, name: 'Mea' },
    { id: 14, name: 'Neo' },
  ]

  permittedUsers = this.users.slice(2, 4)

  getRemainingUsers = () => this.users.filter(u => this.permittedUsers.includes(u) === false)

  permitNewUsers = (newUsers: { id: number, name: string }[]) => this.permittedUsers = [...this.permittedUsers, ...newUsers]

  removePermittedUser = (id: number) => this.permittedUsers = this.permittedUsers.filter(u => u.id !== id)
}

export default new UserConnection()

export class User {
  fullname: string
  dob: Date
  gender: 'M' | 'F'
  contacts?: {
    type: 'email' | 'phone'
    value: string
  } []
  occupation?: string
}

class MedicalStaff extends User {
  id: number
  medicalInstituition?: {
    role?: string
    name?: string
    address?: string
    department?: string
  }
}