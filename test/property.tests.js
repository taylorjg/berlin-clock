const { expect } = require('chai')
const fc = require('fast-check')
const { toBerlinClock } = require('../src')

const countOnes = xs => xs.filter(x => x === 1).length
const totalHours = r => countOnes(r.fiveHours) * 5 + countOnes(r.oneHours)
const totalMinutes = r => countOnes(r.fiveMinutes) * 5 + countOnes(r.oneMinutes)

const arrayOfOnesThenZeros = size => fc
  .integer(0, size)
  .map(numOnes => [
    ...Array(numOnes).fill(1),
    ...Array(size - numOnes).fill(0)
  ])

const BerlinClockResultArbitrary = fc
  .record({
    seconds: fc.constantFrom(0, 1),
    fiveHours: arrayOfOnesThenZeros(4),
    oneHours: arrayOfOnesThenZeros(4),
    fiveMinutes: arrayOfOnesThenZeros(11),
    oneMinutes: arrayOfOnesThenZeros(4)
  })
  .filter(r => totalHours(r) < 24)

const resultToTime = r => {
  const h = totalHours(r)
  const m = totalMinutes(r)
  const s = r.seconds
  const pad = n => n.toString().padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

describe('Berlin Clock property tests', () => {
  it('round-trip starting with random result', () => {
    fc.assert(
      fc.property(
        BerlinClockResultArbitrary, result => {
          const time = resultToTime(result)
          const actual = toBerlinClock(time)
          expect(actual).to.deep.equal(result)
        }))
  })
})
