import qs from 'qs'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class UserStore extends StoreBase {
  private user: Patient | undefined
  private firebaseUser: FirebaseAuthTypes.User | undefined
  private medicalStaff: MedicalStaff[]
  private isRegistering: boolean
  private isReady: boolean

  constructor() {
    super()
    this.medicalStaff = []
    this.isRegistering = false
    this.isReady = false
  }

  unsubscribe = auth().onAuthStateChanged(firebaseUser => {
    // console.log('running')
    if (firebaseUser) {
      // console.log('login', firebaseUser.phoneNumber)
      this.setFirebaseUser(firebaseUser)
      this.isRegistering ? null : this.fetchUser().then(() => {
        this.isReady = true
        this.trigger(UserStore.IsReadyKey)
      })
    } else {
      this.user = undefined
      this.firebaseUser = undefined
      this.isReady = true
      this.trigger(UserStore.IsReadyKey)
    }
  })

  setFirebaseUser = (firebaseUser: FirebaseAuthTypes.User) => this.firebaseUser = firebaseUser

  getToken = async () => await this.firebaseUser?.getIdToken().catch(err => err)

  // endpoints
  fetchUser = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://10.0.2.2:8001/user/get', {
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
            this.user = new Patient(data)
            this.trigger(UserStore.UserKey)
          }
        }).catch(err => Promise.reject(new Error('FetchUser: ' + err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  fetchAllMedicalStaff = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://10.0.2.2:8001/medicalStaff/all', {
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
            this.medicalStaff = data.map((p: any) => new MedicalStaff(p))
            this.trigger(UserStore.MedicalStaffKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Patient: ' + err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  createUser = (info: { username: string, dob: string, gender: 'M' | 'F', email: string, occupation?: string }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://10.0.2.2:8001/user/create', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            user: {
              type: 'Patient',
              phoneNumber: this.firebaseUser?.phoneNumber ?? '',
              ...info
            }
          })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(() => {
          this.user = new Patient({ id: this.firebaseUser?.uid ?? '', phoneNumber: this.firebaseUser?.phoneNumber ?? '', ...info })
          this.trigger(UserStore.UserKey)
        }).catch(err => { throw new Error(err) })
      } else {
        throw new Error('No Token Found')
      }
    })

  updateProfile = (latest: { username: string, dob: string, gender: 'M' | 'F', email: string, occupation?: string }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://10.0.2.2:8001/user/update', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            user: {
              type: 'Patient',
              ...latest
            }
          })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          } else {
            this.user = new Patient({ ...this.user, ...latest })
            this.trigger(UserStore.UserKey)
          }
        }).catch(err => { throw new Error(err) })
      } else {
        throw new Error('No Token Found')
      }
    })

  removeAccount = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://10.0.2.2:8001/user/delete', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken
          })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          }
        }).catch(err => { throw new Error(err) })
      } else {
        throw new Error('No Token Found')
      }
    })

  // variables
  static UserKey = 'UserKey'
  @autoSubscribeWithKey('UserKey')
  getUser() {
    return this.user
  }

  static MedicalStaffKey = 'MedicalStaffKey'
  @autoSubscribeWithKey('MedicalStaffKey')
  getMedicalStaff() {
    return this.medicalStaff
  }

  static IsReadyKey = 'IsReadyKey'
  @autoSubscribeWithKey('IsReadyKey')
  ready() {
    return this.isReady
  }

  setRegister(register: boolean) {
    this.isRegistering = register
  }
}

class UR {
  id: string
  username: string
  dob: Date
  gender: 'M' | 'F'
  email: string

  constructor(input: { id: string, username: string, dob: string, gender: 'M' | 'F', email: string }) {
    const { id, username, dob, gender, email } = input

    this.id = id
    this.username = username
    this.dob = new Date(dob)
    this.gender = gender
    this.email = email
  }
}

class MedicalStaff extends UR {
  type: 'Medical Staff' = 'Medical Staff'
  medicalInstituition: MedicalInstituition

  constructor(input: any) {
    super({ ...input })
    const { medicalInstituition } = input
    this.medicalInstituition = new MedicalInstituition({ ...medicalInstituition })
  }
}

class Patient extends UR {
  type: 'Patient' = 'Patient'
  phoneNumber: string
  occupation: string

  constructor(input: any) {
    super({ ...input })
    const { phoneNumber, occupation } = input
    this.phoneNumber = phoneNumber
    this.occupation = occupation
  }

}

class MedicalInstituition {
  role: string
  name: string
  address: string
  department: string

  constructor(input: { role: string, name: string, address: string, department: string }) {
    const { role, name, address, department } = input
    this.role = role
    this.name = name
    this.address = address
    this.department = department
  }
}

export {
  MedicalStaff,
  Patient
}
export default new UserStore()