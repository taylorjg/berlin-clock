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
  for (const [name, value] of Object.entries(additionalAttributes)) {
    element.setAttribute(name, value)
  }
  return element
}

const normalisePathDataWhitespace = d => d.replace(/\s+/g, ' ').trim()

const createSvgPathElement = (d, additionalAttributes) =>
  createSvgElement('path', {
    d: normalisePathDataWhitespace(d),
    ...additionalAttributes
  })

const svgWidth = berlinClockElement.scrollWidth
const svgHeight = berlinClockElement.scrollHeight
const borderWidth = 1.5 / 54 * svgWidth
const beaconRadius = 9 / 54 * svgWidth
const beaconHeight = beaconRadius * 2 + borderWidth
const rowWidth = svgWidth
const rowHeight = 11 / 54 * svgWidth
const rowSpacerWidth = 13 / 54 * svgWidth
const rowSpacerHeight = 3 / 54 * svgWidth
const leftRowSpacerX = 7 / 54 * svgWidth
const rightRowSpacerX = 33 / 54 * svgWidth
const stemWidth = 8 / 54 * svgWidth

const drawBerlinClockFramework = () => {
  drawBerlinClockBeacon()
  drawBerlinClockBeaconCollar()
  drawBerlinClockRows()
  drawBerlinClockStem()
}

const makeBeaconCutoutPathData = () => {
  const cutoutRadius = beaconRadius - borderWidth
  return `
    M${svgWidth / 2},${borderWidth}
    a${cutoutRadius},${cutoutRadius},0,1,1,${-0.001},${0}
  `
}

const drawBerlinClockBeacon = () => {
  const outline = `
    M${svgWidth / 2},${0}
    a${beaconRadius},${beaconRadius},0,1,1,${-0.001},${0}
  `
  const cutout = makeBeaconCutoutPathData()
  const d = [outline, cutout].join(' ')
  const path = createSvgPathElement(d, {
    fill: 'silver',
    'fill-rule': 'evenodd'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockBeaconCollar = () => {
  const cx = svgWidth / 2
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
  const path = createSvgPathElement(d, {
    fill: 'silver'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockRows = () => {
  drawBerlinClockRow(1, 4)
  drawBerlinClockRowSpacers(1)
  drawBerlinClockRow(2, 4)
  drawBerlinClockRowSpacers(2)
  drawBerlinClockRow(3, 11)
  drawBerlinClockRowSpacers(3)
  drawBerlinClockRow(4, 4)
}

const drawBerlinClockRow = (row, numSegments) => {
  const h = beaconHeight + (rowHeight + rowSpacerHeight) * (row - 1)
  const dx = borderWidth
  const dy = borderWidth
  const outline = `
    M${0},${h + dy}
    a${dx},${dy},0,0,1,${dx},${-dy}
    h${rowWidth - dx - dx}
    a${dx},${dy},0,0,1,${dx},${dy}
    v${rowHeight - dy - dy}
    a${dx},${dy},0,0,1,${-dx},${dy}
    h${-rowWidth + dx + dx}
    a${dx},${dy},0,0,1,${-dx},${-dy}
    z
  `
  const rw = (rowWidth - (numSegments * borderWidth + borderWidth)) / numSegments
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
  const path = createSvgPathElement(d, {
    fill: 'silver',
    'fill-rule': 'evenodd'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockRowSpacers = row => {
  drawBerlinClockRowSpacer(row, LEFT_ROW_SPACER)
  drawBerlinClockRowSpacer(row, RIGHT_ROW_SPACER)
}

const LEFT_ROW_SPACER = Symbol('LEFT_ROW_SPACER')
const RIGHT_ROW_SPACER = Symbol('RIGHT_ROW_SPACER')

const drawBerlinClockRowSpacer = (row, position) => {
  const x = position === LEFT_ROW_SPACER ? leftRowSpacerX : rightRowSpacerX
  const y = beaconHeight + rowHeight * row + rowSpacerHeight * (row - 1)
  const r = 1
  const d = `
    M${x},${y}
    a${r},${r},0,0,1,${0},${rowSpacerHeight}
    h${rowSpacerWidth}
    a${r},${r},0,0,1,${0},${-rowSpacerHeight}
    z
  `
  const path = createSvgPathElement(d, {
    fill: 'silver'
  })
  berlinClockElement.appendChild(path)
}

const drawBerlinClockStem = () => {
  const y = beaconHeight + rowHeight * 4 + rowSpacerHeight * 3
  const rect = createSvgElement('rect', {
    x: svgWidth / 2 - stemWidth / 2,
    y,
    width: stemWidth,
    height: Math.max(svgHeight - y, 0),
    fill: 'silver'
  })
  berlinClockElement.appendChild(rect)
}

const drawBerlinClockLights = berlinClockData => {
  const lightElements = berlinClockElement.querySelectorAll('[data-light]')
  for (const lightElement of lightElements) {
    berlinClockElement.removeChild(lightElement)
  }
  const beaconLightPathData = makeBeaconCutoutPathData()
  const beaconLight = createSvgPathElement(beaconLightPathData, {
    fill: berlinClockData.seconds ? 'orange' : 'transparent',
    'data-light': true
  })
  berlinClockElement.appendChild(beaconLight)
}

drawBerlinClockFramework()
