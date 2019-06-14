const moment = require('moment')

const positiveIntegers = n => Array(n).fill(0).map((_, index) => index + 1)

const toBerlinClock = time => {
  const hms = moment.duration(time)
  const h = hms.hours()
  const m = hms.minutes()
  const s = hms.seconds()
  return {
    seconds: Number(s % 2),
    fiveHours: positiveIntegers(4).map(n => Number(h >= n * 5)),
    oneHours: positiveIntegers(4).map(n => Number(h % 5 >= n)),
    fiveMinutes: positiveIntegers(11).map(n => Number(m >= n * 5)),
    oneMinutes: positiveIntegers(4).map(n => Number(m % 5 >= n))
  }
}

module.exports = {
  toBerlinClock
}
