import qs from 'qs'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class UserStore extends StoreBase {
  private user: User | undefined
  private firebaseUser: FirebaseAuthTypes.User | undefined
  private isRegistering: boolean = false
  private isReady: boolean = false

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
          this.user = new User(data)
          this.trigger(UserStore.UserKey)
        }).catch(err => Promise.reject(new Error('FetchUser: ' + err)))
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
            return
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(() => {
          this.user = new User({ id: this.firebaseUser?.uid ?? '', phoneNumber: this.firebaseUser?.phoneNumber ?? '', ...info })
          this.trigger(UserStore.UserKey)
        })
          .catch(err => new Error(err))
      } else {
        throw new Error('No Token Found')
      }
    })

  updateProfile = (latest: User) =>
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
        })
          .catch(err => new Error(err))
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
        })
          .catch(err => new Error(err))
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

  setRegister(register: boolean) {
    this.isRegistering = register
  }

  static IsReadyKey = 'IsReadyKey'
  @autoSubscribeWithKey('IsReadyKey')
  ready() {
    return this.isReady
  }
}

export class User {
  id: string
  username: string
  dob: Date
  gender: 'M' | 'F'
  email: string
  phoneNumber: string
  occupation?: string

  constructor({ id, username, dob, gender, email, phoneNumber, occupation }: { id: string, username: string, dob: string, gender: 'M' | 'F', email: string, phoneNumber: string, occupation?: string }) {
    this.id = id
    this.username = username
    this.dob = new Date(dob)
    this.gender = gender
    this.email = email
    this.phoneNumber = phoneNumber
    this.occupation = occupation
  }
}

export default new UserStore()