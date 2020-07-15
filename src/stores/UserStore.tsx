import qs from 'qs'
import { Platform } from 'react-native'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

import { getURL } from '../utils/Common'
import NotificationStore from './NotificationStore'

@AutoSubscribeStore
class UserStore extends StoreBase {
  private user: Patient | undefined
  private firebaseUser: FirebaseAuthTypes.User | undefined
  private medicalStaff: MedicalStaff[]
  private patients: {
    authorized: Patient[],
    notAuthorized: Patient[]
  }
  private isRegistering: boolean
  private isReady: boolean

  constructor() {
    super()
    this.medicalStaff = []
    this.patients = {
      authorized: [],
      notAuthorized: []
    }
    this.isRegistering = false
    this.isReady = false
  }

  unsubscribeOnAuthStateChanged = auth().onAuthStateChanged(firebaseUser => {
    // console.log('running')
    if (firebaseUser) {
      // console.log('login', firebaseUser.phoneNumber)
      this.setFirebaseUser(firebaseUser)

      // Get Instance ID token. Initially this makes a network call, once retrieved subsequent calls to getToken will return from cache.
      messaging().getToken().then((currentToken) => {
        if (currentToken) {
          NotificationStore.sendTokenToServer(currentToken)

          if (Platform.OS === 'ios') {
            messaging().hasPermission().then(async status => {
              if (status !== FirebaseMessagingTypes.AuthorizationStatus.AUTHORIZED && status !== FirebaseMessagingTypes.AuthorizationStatus.PROVISIONAL)
                return await messaging().requestPermission()
            })
          }
        } else {
          throw new Error('No Instance ID token available. Request permission to generate one.')
        }
      }).then(async () => {
        if (this.isRegistering == false) {
          await this.fetchUser()
            .catch(err => {
              if (err.message.includes('No such user')) {
                console.log('account info missing')
              }
            })
        }
      }).finally(() => {
        this.isReady = true
        this.trigger()
      })
    } else {
      this.user = undefined
      this.firebaseUser = undefined
      this.isReady = true
      this.trigger()
    }
  })

  setFirebaseUser = (firebaseUser: FirebaseAuthTypes.User) => Promise.resolve(
    this.firebaseUser = firebaseUser
  ).then(async () => {
    if (this.isRegistering == false) {
      await this.fetchUser()
        .catch(err => {
          if (err.message.includes('No such user')) {
            console.log('account info missing')
          }
        })
    }
  }).finally(() => {
    this.isReady = true
    this.trigger(UserStore.IsReadyKey)
  })

  getToken = async () => await this.firebaseUser?.getIdToken().catch(err => err)

  checkExistingUser = (phoneNumber: string) =>
    fetch(getURL() + '/patient/exist', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({ phoneNumber })
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
        return Boolean(data.hasUser)
      }
    }).catch(err => Promise.reject(new Error('Fetch User: ' + err)))

  // endpoints
  fetchUser = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/user/get', {
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
            throw data.errors
          } else {
            this.user = new Patient(data)
            this.trigger(UserStore.UserKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch User: ' + err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  fetchAllMedicalStaff = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/medicalStaff/all', {
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
            throw data.errors
          } else {
            this.medicalStaff = data.map((p: any) => new MedicalStaff(p))
            this.trigger(UserStore.MedicalStaffKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Medical Staff: ' + err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  fetchAllPatients = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/patient/all', {
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
            throw data.errors
          } else {
            const allPatients = (data as Array<any>).map(p => new Patient(p)).filter(p => p.id !== this.user?.id)
            const authorizedList = this.user?.authorizedUsers
            console.log(this.user?.authorizedUsers)
            if (authorizedList && authorizedList.length > 0) {
              this.patients = allPatients.reduce<{
                authorized: Patient[], notAuthorized: Patient[]
              }>((all, p) => authorizedList.includes(p.id)
                ? { ...all, authorized: [ ...all.authorized, p ] }
                : { ...all, notAuthorized: [ ...all.notAuthorized, p ] }
                , {
                  authorized: [], notAuthorized: []
                })
            } else {
              this.patients = { authorized: [], notAuthorized: allPatients }
            }
            this.trigger(UserStore.PatientKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Medical Staff: ' + err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  createUser = (info: { username: string, dob: Date, gender: 'M' | 'F', email: string, occupation?: string }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/user/create', {
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
            throw response.status + ': (' + response.statusText + ')'
          }
        }).then(result => {
          if (result.errors) {
            throw result.errors
          } else {
            this.user = new Patient({ id: this.firebaseUser?.uid ?? '', phoneNumber: this.firebaseUser?.phoneNumber ?? '', ...info })
            this.trigger(UserStore.UserKey)
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  updateProfile = (latest: { username: string, dob: Date, gender: 'M' | 'F', email: string, occupation?: string }) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/user/update', {
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
            throw response.status + ': (' + response.statusText + ')'
          }
        }).then(result => {
          if (result.errors) {
            throw result.errors
          } else {
            this.user = new Patient({ ...this.user, ...latest })
            this.trigger(UserStore.UserKey)
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  updateAuthorizedUsers = (userIds: string[]) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/user/authorized/update', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, userIds })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw response.status + ': (' + response.statusText + ')'
          }
        }).then(result => {
          if (result.errors) {
            throw result.errors
          } else {
            const result = this.patients.notAuthorized.reduce<{
              target: Patient[], remaining: Patient[]
            }>((all, p) => userIds.includes(p.id)
              ? { ...all, target: [ ...all.target, p ] }
              : { ...all, remaining: [ ...all.remaining, p ] }
              , {
                target: [], remaining: []
              })
            this.patients = {
              authorized: [ ...this.patients.authorized, ...result.target ],
              notAuthorized: result.remaining
            }
            if (this.user) {
              this.user = {
                ...this.user,
                authorizedUsers: [ ...this.user?.authorizedUsers ?? [], ...userIds ]
              }
            }
            this.trigger([ UserStore.PatientKey, UserStore.UserKey ])
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  removeAuthorizedUsers = (userIds: string[]) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/user/authorized/remove', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, userIds })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw response.status + ': (' + response.statusText + ')'
          }
        }).then(result => {
          if (result.errors) {
            throw result.errors
          } else {
            const result = this.patients.authorized.reduce<{
              target: Patient[], remaining: Patient[]
            }>((all, p) => userIds.includes(p.id)
              ? { ...all, target: [ ...all.target, p ] }
              : { ...all, remaining: [ ...all.remaining, p ] }
              , {
                target: [], remaining: []
              })
            this.patients = {
              authorized: result.remaining,
              notAuthorized: [ ...this.patients.notAuthorized, ...result.target ]
            }
            if (this.user) {
              this.user = {
                ...this.user,
                authorizedUsers: this.user?.authorizedUsers.filter(au => userIds.includes(au) === false) ?? []
              }
            }
            this.trigger([ UserStore.PatientKey, UserStore.UserKey ])
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
      }
    })

  removeAccount = () =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch(getURL() + '/user/delete', {
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
            throw response.status + ': (' + response.statusText + ')'
          }
        }).then(result => {
          if (result.errors) {
            throw result.errors
          }
        }).catch(err => Promise.reject(new Error(err)))
      } else {
        Promise.reject(new Error('No Token Found'))
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

  static PatientKey = 'PatientKey'
  @autoSubscribeWithKey('PatientKey')
  getPatients() {
    return this.patients
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
  workingTime?: ByTimeWT

  constructor(input: any) {
    super({ ...input })
    const { medicalInstituition, workingTime } = input
    this.medicalInstituition = new MedicalInstituition({ ...medicalInstituition })
    this.workingTime = workingTime
      ? workingTime.type === 'byTime'
        ? new ByTimeWT(workingTime)
        : undefined
      : undefined
  }
}

class Patient extends UR {
  type: 'Patient' = 'Patient'
  phoneNumber: string
  occupation: string
  authorizedUsers: string[]

  constructor(input: any) {
    super({ ...input })
    const { phoneNumber, occupation, authorizedUsers } = input
    this.phoneNumber = phoneNumber
    this.occupation = occupation
    this.authorizedUsers = authorizedUsers as Array<any>

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

class ByTimeWT {
  timeslots: {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6
    slots: Date[]
  }[]

  constructor(input: any) {
    const { timeslots } = input
    this.timeslots = (timeslots as Array<any>).map(ts => ({
      day: ts.day,
      slots: (ts.slots as Array<any>).map(s => new Date(s))
    }))
  }
}

export {
  MedicalStaff,
  Patient,
  ByTimeWT
}
export default new UserStore()