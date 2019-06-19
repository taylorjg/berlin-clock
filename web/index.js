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

const normalisePathData = d => d.replace(/\s+/g, ' ').trim()

const createSvgElement = (elementName, additionalAttributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', elementName)
  for (const [name, value] of Object.entries(additionalAttributes)) {
    element.setAttribute(name, value)
  }
  return element
}

const w = berlinClockElement.scrollWidth
const h = berlinClockElement.scrollHeight
const borderWidth = 1.5 / 54 * w
const beaconRadius = 9 / 54 * w
const beaconHeight = beaconRadius * 2 + borderWidth
const rowHeight = 11 / 54 * w
const spacerWidth = 13 / 54 * w
const spacerHeight = 3 / 54 * w
const leftSpacerX = 7 / 54 * w
const rightSpacerX = 33 / 54 * w
const stemWidth = 8 / 54 * w

const drawBerlinClockFramework = () => {
  drawBerlinClockBeacon()
  drawBerlinClockBeaconCollar()
  drawBerlinClockRows()
  drawBerlinClockStem()
}

const drawBerlinClockBeacon = () => {
  const outline = `
    M${w / 2},${0}
    a${beaconRadius},${beaconRadius},0,1,1,${-0.001},${0}
  `
  const cutoutRadius = beaconRadius - borderWidth
  const cutout = `
    M${w / 2},${borderWidth}
    a${cutoutRadius},${cutoutRadius},0,1,1,${-0.001},${0}
  `
  const d = [outline, cutout].join(' ')
  const path = createSvgElement('path', {
    d: normalisePathData(d),
    fill: 'silver',
    'fill-rule': 'evenodd'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockBeaconCollar = () => {
  const cx = w / 2
  const cy = beaconRadius
  const angle = Math.PI / 180 * 120
  const x = cx + beaconRadius * Math.cos(angle)
  const y = cy + beaconRadius * Math.sin(angle)
  const collarWidth = 2 * (cx - x)
  const collarHeight = beaconHeight - y
  const r = 10
  const d = `
    M${x},${y}
    a${r},${r},0,0,1,${0},${collarHeight}
    h${collarWidth}
    a${r},${r},0,0,1,${0},${-collarHeight}
    z
  `
  const path = createSvgElement('path', {
    d: normalisePathData(d),
    fill: 'silver'
  })
  berlinClockElement.appendChild(path)
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
  const h = beaconHeight + (rowHeight + spacerHeight) * (row - 1)
  const dx = borderWidth
  const dy = borderWidth
  const outline = `
    M${0},${h + dy}
    a${dx},${dy},0,0,1,${dx},${-dy}
    h${w - dx - dx}
    a${dx},${dy},0,0,1,${dx},${dy}
    v${rowHeight - dy - dy}
    a${dx},${dy},0,0,1,${-dx},${dy}
    h${-w + dx + dx}
    a${dx},${dy},0,0,1,${-dx},${-dy}
    z
  `
  const rw = (w - (numSegments * borderWidth + borderWidth)) / numSegments
  const rh = rowHeight - 2 * borderWidth
  const firstSegmentIndex = 0
  const lastSegmentIndex = numSegments - 1
  const cutouts = Array.from(Array(numSegments).keys()).map(segmentIndex => {
    const x = (segmentIndex * borderWidth + borderWidth) + (segmentIndex * rw)
    const y = h + borderWidth
    switch (segmentIndex) {
      case firstSegmentIndex:
        return `
          M${x},${y + dy}
          a${dx},${dy},0,0,1,${dx},${-dy}
          h${rw - dx}
          v${rh}
          h${-rw + dx}
          a${dx},${dy},0,0,1,${-dx},${-dy}
          z
        `
      case lastSegmentIndex:
        return `
          M${x},${y}
          h${rw - dx}
          a${dx},${dy},0,0,1,${dx},${dy}
          v${rh - dy - dy}
          a${dx},${dy},0,0,1,${-dx},${dy}
          h${-rw + dx}
          z
        `
      default:
        return `
          M${x},${y}
          h${rw}
          v${rh}
          h${-rw}
          z
        `
    }
  })
  const d = [outline, ...cutouts].join(' ')
  const path = createSvgElement('path', {
    d: normalisePathData(d),
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
  const x = position === LEFT_SPACER ? leftSpacerX : rightSpacerX
  const y = beaconHeight + rowHeight * row + spacerHeight * (row - 1)
  const r = 1
  const d = `
    M${x},${y}
    a${r},${r},0,0,1,${0},${spacerHeight}
    h${spacerWidth}
    a${r},${r},0,0,1,${0},${-spacerHeight}
    z
  `
  const path = createSvgElement('path', {
    d: normalisePathData(d),
    fill: 'silver'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockStem = () => {
  const y = beaconHeight + rowHeight * 4 + spacerHeight * 3
  const rw = stemWidth
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
