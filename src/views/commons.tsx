const day = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const hour12 = (date: Date | undefined) => {
  if (date) {
    const hr = date.getHours()
    const min = date.getMinutes()
    const isPM = hr >= 12

    return (hr % 12 === 0 ? '12' : (hr % 12))
      + ':' + min.toString().padStart(2, '0')
      + (isPM ? ' PM' : ' AM')
  } else {
    return '-'
  }
}

export {
  day,
  month,
  hour12
}