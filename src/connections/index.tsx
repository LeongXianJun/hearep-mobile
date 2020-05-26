export { default as UserC } from './UserConnection'
export * from './UserConnection'

export { default as RecordC } from './RecordConnection'
export * from './RecordConnection'

export { default as AppointmentC } from './AppointmentConnection'
export * from './AppointmentConnection'

export const isObject = (obj: any): obj is Object => {
  return typeof obj === 'object'
}

export const isUndefined = (obj: any): obj is undefined => {
  return obj === undefined
}