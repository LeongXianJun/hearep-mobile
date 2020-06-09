export const isObject = (obj: any): obj is Object => {
  return typeof obj === 'object'
}

export const isUndefined = (obj: any): obj is undefined => {
  return obj === undefined
}