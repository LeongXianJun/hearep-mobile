import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { UserStore } from '../stores'

let confirmR: FirebaseAuthTypes.ConfirmationResult | undefined

const signIn = (phoneNumber: string) =>
  auth().signInWithPhoneNumber(phoneNumber)
    .then(result => confirmR = result)

const verifyCode = (code: string) =>
  new Promise((resolve, reject) =>
    confirmR
      ? confirmR.confirm(code)
        .then(user => {
          if (user) {
            UserStore.setFirebaseUser(user)
            resolve()
          } else
            reject('Please sign in again')
        }).catch(err => {
          if (err.message.includes('auth/invalid-verification-code')) {
            reject('You enter the wrong code. Please re-enter the code or request a new OTP code')
          } else {
            reject(err)
          }
        })
      : reject('Please enter your phone number')
  ).catch(err => { throw new Error(err) })

const signOut = () => auth().signOut()

export default {
  signIn,
  verifyCode,
  signOut
}