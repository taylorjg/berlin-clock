const { expect } = require('chai')
const { toBerlinClock } = require('../src')

const ZERO = {
  seconds: 0,
  fiveHours: [0, 0, 0, 0],
  oneHours: [0, 0, 0, 0],
  fiveMinutes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  oneMinutes: [0, 0, 0, 0]
}

const zeroWith = overrides => ({
  ...ZERO,
  ...overrides
})

describe('Berlin Clock unit tests', () => {

  it('handles 00:00:00 correctly', () => {
    const actual = toBerlinClock('00:00:00')
    const expected = ZERO
    expect(actual).to.deep.equal(expected)
  })

  it('handles 01:00:00 correctly', () => {
    const actual = toBerlinClock('01:00:00')
    const expected = zeroWith({ oneHours: [1, 0, 0, 0] })
    expect(actual).to.deep.equal(expected)
  })

  it('handles 05:00:00 correctly', () => {
    const actual = toBerlinClock('05:00:00')
    const expected = zeroWith({ fiveHours: [1, 0, 0, 0] })
    expect(actual).to.deep.equal(expected)
  })

  it('handles 17:49:21 correctly', () => {
    const actual = toBerlinClock('17:49:21')
    const expected = {
      seconds: 1,
      fiveHours: [1, 1, 1, 0],
      oneHours: [1, 1, 0, 0],
      fiveMinutes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      oneMinutes: [1, 1, 1, 1]
    }
    expect(actual).to.deep.equal(expected)
  })
})
