class UserConnection {
  currentUser: User = undefined

  isLogin = () => this.currentUser !== undefined

  login = () => {
    this.currentUser = { 
      username: 'Xian Jun', password: '', email: 'leongxianjun@utar.my', occupation: 'student',
      detail: { 
        fullname: 'Leong Xian Jun', dob: new Date('1999-1-16'), gender: 'M', 
        contacts: [
          { type: 'email', value: 'joneleong@gmail.com' }, 
          { type: 'phone', value: '+60-165663878' }
        ] 
      } 
    }
  }

  medicalStaffDB: MedicalStaff[] = [
    { 
      id: 1, username: 'Dr. JoneLeong', password: '123123123', email: 'leongxianjun@1utar.my', 
      detail: { 
        fullname: 'Jone Leong', dob: new Date('1999-1-16'), gender: 'M', 
        contacts: [
          { type: 'email', value: 'joneleong@gmail.com' }, 
          { type: 'phone', value: '+60-165663878' }
        ] 
      },
      medicalInstituition: {
        role: 'Doctor',
        name: 'Leong Hospital',
        address: '40, Jalan Berjaya, Sungai Chua, 43000 Kajang, Selangor',
        department: 'Common Illness'
      }
    }, { 
      id: 2, username: 'Dr. Jane', password: '123123123', email: 'jane@hearep.info', 
      detail: { 
        fullname: 'Jane', dob: new Date('1980-3-15'), gender: 'F', 
        contacts: [
          { type: 'email', value: 'jane@gmail.com' }, 
          { type: 'phone', value: '+60-123456789' }
        ] 
      },
      medicalInstituition: {
        role: 'Doctor',
        name: 'Leong Hospital',
        address: '40, Jalan Berjaya, Sungai Chua, 43000 Kajang, Selangor',
        department: 'Specialist'
      }
    }
  ]
}

export default new UserConnection()

export class User {
  username: string
  email: string
  password: string
  detail?: {
    fullname: string
    dob: Date
    gender: 'M' | 'F'
    contacts?: {
      type: 'email' | 'phone'
      value: string
    } []
  }
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