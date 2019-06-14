const moment = require('moment')

const toBerlinClock = time => {
  const hms = moment.duration(time)
  const h = hms.hours()
  const m = hms.minutes()
  const s = hms.seconds()
  return {
    seconds: s % 2,
    fiveHours: [
      h >= 5 ? 1 : 0,
      h >= 10 ? 1 : 0,
      h >= 15 ? 1 : 0,
      h >= 20 ? 1 : 0],
    oneHours: [
      h % 5 >= 1 ? 1 : 0,
      h % 5 >= 2 ? 1 : 0,
      h % 5 >= 3 ? 1 : 0,
      h % 5 >= 4 ? 1 : 0
    ],
    fiveMinutes: [
      m >= 5 ? 1 : 0,
      m >= 10 ? 1 : 0,
      m >= 15 ? 1 : 0,
      m >= 20 ? 1 : 0,
      m >= 25 ? 1 : 0,
      m >= 30 ? 1 : 0,
      m >= 35 ? 1 : 0,
      m >= 40 ? 1 : 0,
      m >= 45 ? 1 : 0,
      m >= 50 ? 1 : 0,
      m >= 55 ? 1 : 0
    ],
    oneMinutes: [
      m % 5 >= 1 ? 1 : 0,
      m % 5 >= 2 ? 1 : 0,
      m % 5 >= 3 ? 1 : 0,
      m % 5 >= 4 ? 1 : 0
    ]
  }
}

module.exports = {
  toBerlinClock
}
