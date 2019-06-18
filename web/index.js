import * as moment from 'moment'
import { toBerlinClock } from '../src'

const berlinClockElement = document.getElementById('berlin-clock')
const textClockElement = document.getElementById('text-clock')

const updateTime = () => {
  const oldTime = textClockElement.innerText
  const newTime = moment().format('HH:mm:ss')
  if (newTime !== oldTime) {
    textClockElement.innerText = newTime
    drawBerlinClockLights(toBerlinClock(newTime))
  }
  requestAnimationFrame(updateTime)
}
requestAnimationFrame(updateTime)

const createSvgElement = (elementName, additionalAttributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', elementName)
  Object.entries(additionalAttributes).forEach(([name, value]) =>
    element.setAttribute(name, value))
  return element
}

const drawBerlinClockFramework = () => {
  drawBerlinClockBeacon()
  drawBerlinClockRows()
  drawBerlinClockStem()
}

const drawBerlinClockStem = () => {
  const w = berlinClockElement.scrollWidth
  const rect = createSvgElement('rect', {
    x: w / 2 - 20,
    y: 400,
    width: 40,
    height: 100,
    fill: 'silver'
  })
  berlinClockElement.appendChild(rect)
}

const drawBerlinClockRows = () => {
  drawBerlinClockRow(1, 4)
  drawBerlinClockSpacers(1)
  drawBerlinClockRow(2, 4)
  drawBerlinClockSpacers(2)
  drawBerlinClockRow(3, 11)
  drawBerlinClockSpacers(3)
  drawBerlinClockRow(4, 4)
}

const drawBerlinClockRow = (row, numSegments) => {
  const w = berlinClockElement.scrollWidth
  const h1 = 60 + w / 8 * row // TODO: add constant
  const h2 = h1 + w / 8
  const tl = { x: 0, y: h1 }
  const tr = { x: w, y: h1 }
  const br = { x: w, y: h2 }
  const bl = { x: 0, y: h2 }
  const dx = 10 // TODO: add constant
  const dy = 10 // TODO: add constant
  const outline = `
    M${tl.x},${tl.y + dy}
    A${dx},${dy},0,0,1,${tl.x + dx},${tl.y}
    L${tr.x - dx},${tr.y}
    A${dx},${dy},0,0,1,${tr.x},${tl.y + dy}
    L${br.x},${br.y - dy}
    A${dx},${dy},0,0,1,${br.x - dx},${br.y}
    L${bl.x + dx},${bl.y}
    A${dx},${dy},0,0,1,${bl.x},${bl.y - dy}
    L${tl.x},${tl.y - dy}
  `
  const bw = 7 // TODO: add constant
  const rw = (w - (numSegments * bw + bw)) / numSegments
  const rh = h2 - h1 - 2 * bw
  const firstSegmentIndex = 0
  const lastSegmentIndex = numSegments - 1
  const cutouts = Array.from(Array(numSegments).keys()).map(n => {
    const tlx = (n * bw + bw) + (n * rw)
    const tly = tl.y + bw
    switch (n) {
      case firstSegmentIndex:
        return `
          M${tlx},${tly + dy}
          a${dx},${dy},0,0,1,${dx},${-dy}
          h${rw - dx}
          v${rh}
          h${-rw + dx}
          a${dx},${dy},0,0,1,${-dx},${-dy}
          z
        `
      case lastSegmentIndex:
        return `
          M${tlx},${tly}
          h${rw - dx}
          a${dx},${dy},0,0,1,${dx},${dy}
          v${rh - dy - dy}
          a${dx},${dy},0,0,1,${-dx},${dy}
          h${-rw + dx}
          z
        `
      default:
        return `
          M${tlx},${tly}
          h${rw}
          v${rh}
          h${-rw}
          z
        `
    }
  })
  const d = [outline, ...cutouts].join(' ')
  const path = createSvgElement('path', {
    d,
    fill: 'silver',
    'fill-rule': 'evenodd'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockSpacers = row => {
  drawBerlinClockSpacer(row, LEFT_SPACER)
  drawBerlinClockSpacer(row, RIGHT_SPACER)
}

const LEFT_SPACER = Symbol('LEFT_SPACER')
const RIGHT_SPACER = Symbol('RIGHT_SPACER')

const drawBerlinClockSpacer = (row, position) => {
  const w = berlinClockElement.scrollWidth
  const dx = w / 8 // TODO: add constant
  const x1 = position === LEFT_SPACER ? dx : 5 * dx
  const y1 = row * 80 // TODO: add constant
  const x2 = x1 + 2 * dx
  const y2 = y1 + 20 // TODO: add constant
  const r = 5 // TODO: add constant
  const d = `
    M${x1},${y1}
    A${r},${r},0,0,1,${x1},${y2}
    L${x2},${y2}
    A${r},${r},0,0,1,${x2},${y1}
    Z
  `
  const path = createSvgElement('path', {
    d,
    fill: 'silver'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockBeacon = () => {
  const w = berlinClockElement.scrollWidth
  const r1 = w / 10 // TODO: add constant
  const r2 = w / 12 // TODO: add constant
  const d1 = `
    M${w / 2},${0}
    A${r1},${r1},0,1,1,${w / 2 - 0.001},${0}
    M${w / 2},${r1 - r2}
    A${r2},${r2},0,1,1,${w / 2 - 0.001},${r1 - r2}
  `
  const path1 = createSvgElement('path', {
    d: d1,
    fill: 'silver',
    'fill-rule': 'evenodd'
  })
  berlinClockElement.appendChild(path1)
  const cx = w / 2
  const cy = r1
  const angle1 = Math.PI / 180 * 55
  const angle2 = Math.PI / 180 * 125
  const x1 = cx + r1 * Math.cos(angle1)
  const y1 = cy + r1 * Math.sin(angle1)
  const x2 = cx + r1 * Math.cos(angle2)
  const y2 = y1 + (r1 - r2) * 2
  const r = 5 // TODO: add constant
  const d2 = `
    M${x1},${y1}
    A${r},${r},0,0,0,${x1},${y2}
    L${x2},${y2}
    A${r},${r},0,0,0,${x2},${y1}
    Z
  `
  const path2 = createSvgElement('path', {
    d: d2,
    fill: 'silver'
  })
  berlinClockElement.appendChild(path2)
}

const drawBerlinClockLights = () => {
}

drawBerlinClockFramework()
