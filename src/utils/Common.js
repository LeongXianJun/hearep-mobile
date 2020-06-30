import { URL } from 'react-native-dotenv'

export const isObject = (obj) =>
{
  return typeof obj === 'object'
}

export const isUndefined = (obj) =>
{
  return obj === undefined
}

export const getURL = () =>
  __DEV__
    ? 'http://10.0.2.2:8001'
    : URL