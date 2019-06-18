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

const drawBerlinClockBeacon = () => {
  const w = berlinClockElement.scrollWidth
  const r1 = (18 / 54 * w) / 2
  const r2 = r1 - (1.5 / 54 * w)
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
  const angle1 = Math.PI / 180 * 60
  const angle2 = Math.PI / 180 * 120
  const x1 = cx + r1 * Math.cos(angle1)
  const y1 = cy + r1 * Math.sin(angle1)
  const x2 = cx + r1 * Math.cos(angle2)
  const y2 = (18 / 54 * w) + (2 / 54 * w)
  const r = 5
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
  const beaconBottom = (18 / 54 * w) + (2 / 54 * w)
  const h1 = beaconBottom + ((11 / 54 * w) + (3 / 54 * w)) * (row - 1)
  const h2 = h1 + (11 / 54 * w)
  const tl = { x: 0, y: h1 }
  const tr = { x: w, y: h1 }
  const br = { x: w, y: h2 }
  const bl = { x: 0, y: h2 }
  const dx = 10
  const dy = 10
  const outline = `
    M${tl.x},${tl.y + dy}
    A${dx},${dy},0,0,1,${tl.x + dx},${tl.y}
    L${tr.x - dx},${tr.y}
    A${dx},${dy},0,0,1,${tr.x},${tl.y + dy}
    L${br.x},${br.y - dy}
    A${dx},${dy},0,0,1,${br.x - dx},${br.y}
    L${bl.x + dx},${bl.y}
    A${dx},${dy},0,0,1,${bl.x},${bl.y - dy}
    Z
  `
  const bw = 1.5 / 54 * w
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
  const x1 = position === LEFT_SPACER ? 7 / 54 * w : 33 / 54 * w
  const beaconBottom = (18 / 54 * w) + (2 / 54 * w)
  const y1 = beaconBottom + (11 / 54 * w) * row + (3 / 54 * w) * (row - 1) - 3
  const x2 = x1 + (13 / 54 * w)
  const y2 = y1 + (3 / 54 * w) + 4
  const r = 5
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

const drawBerlinClockStem = () => {
  const w = berlinClockElement.scrollWidth
  const h = berlinClockElement.scrollHeight
  const beaconBottom = (18 / 54 * w) + (2 / 54 * w)
  const y = beaconBottom + (11 / 54 * w) * 4 + (3 / 54 * w) * 3 - 3
  const rw = 8 / 54 * w
  const rect = createSvgElement('rect', {
    x: w / 2 - (rw / 2),
    y,
    width: rw,
    height: h - y,
    fill: 'silver'
  })
  berlinClockElement.appendChild(rect)
}

const drawBerlinClockLights = () => {
}

drawBerlinClockFramework()
