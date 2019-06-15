import * as moment from 'moment'
import { toBerlinClock } from '../src'

const timeElement = document.getElementById('time')

const updateTime = () => {
  const oldTime = timeElement.innerText
  const newTime = moment().format('HH:mm:ss')
  if (newTime !== oldTime) {
    timeElement.innerText = newTime
    const result = toBerlinClock(newTime)
    console.log(`result: ${JSON.stringify(result)}`)
  }
  requestAnimationFrame(updateTime)
}
requestAnimationFrame(updateTime)
