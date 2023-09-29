import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { usePatientsStore } from '~/stores/patients'
import type { Patient, BlindSpot, BlindSpotState } from '~/types/patient'
type Point = { x: number; y: number };

class BlindSpotMappingTest {
  private canvas: HTMLCanvasElement
  private readonly id: string
  private readonly polygonColor: string
  private ctx: CanvasRenderingContext2D
  private readonly stimulusPosition: Point
  private blindSpotLeft: Point[]
  private blindSpotRight: Point[]
  private leftPolygon: Path2D | null
  private rightPolygon: Path2D | null
  private leftButton: HTMLElement
  private rightButton: HTMLElement
  private resetButton: HTMLElement
  private leftPolygonArea: HTMLElement
  private rightPolygonArea: HTMLElement
  private leftDotDistance: HTMLElement
  private rightDotDistance: HTMLElement

  constructor (
    canvas: HTMLCanvasElement,
    id: string,
    polygonColor: string,
    leftButton: HTMLElement,
    rightButton: HTMLElement,
    resetButton: HTMLElement,
    leftPolygonArea: HTMLElement,
    rightPolygonArea: HTMLElement,
    leftDotDistance: HTMLElement,
    rightDotDistance: HTMLElement
  ) {
    this.canvas = canvas
    this.id = id
    this.polygonColor = polygonColor
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.stimulusPosition = { x: this.canvas.width / 2, y: this.canvas.height / 2 }
    this.blindSpotLeft = []
    this.blindSpotRight = []
    this.leftPolygon = null
    this.rightPolygon = null
    this.leftButton = leftButton
    this.rightButton = rightButton
    this.resetButton = resetButton
    this.leftPolygonArea = leftPolygonArea
    this.rightPolygonArea = rightPolygonArea
    this.leftDotDistance = leftDotDistance
    this.rightDotDistance = rightDotDistance
    this.setupEventListeners()
    this.drawStimulus()
    this.loadState()
  }

  drawStimulus (): void {
    this.clearCanvas()
    const lineY = this.canvas.height / 2
    this.ctx.beginPath()
    this.ctx.moveTo(0, lineY)
    this.ctx.lineTo(this.canvas.width, lineY)
    this.ctx.strokeStyle = '#adadad'
    this.ctx.stroke()
    this.drawDot(this.stimulusPosition.x, this.stimulusPosition.y, '#DD474D', 5)
  }

  drawDot (x: number, y: number, color = '#474747', size = 3): void {
    this.ctx.beginPath()
    this.ctx.arc(x, y, size, 0, 2 * Math.PI)
    this.ctx.fillStyle = color
    this.ctx.fill()
  }

  clearCanvas (): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  setupEventListeners (): void {
    let leftClicks = 0
    let rightClicks = 0

    this.canvas.addEventListener('click', (event: MouseEvent) => {
      if (!this.leftPolygon || !this.rightPolygon) { // Only add new dots if polygon has not been generated
        const boundingRect = this.canvas.getBoundingClientRect()
        const clickPosition: Point = {
          x: event.clientX - boundingRect.left,
          y: event.clientY - boundingRect.top
        }
        if (this.isLeftSide(clickPosition)) {
          if (leftClicks < 8) { // limit to 8 dots on the left side
            this.blindSpotLeft.push(clickPosition)
            leftClicks++
            this.renderDots()
          }
        } else if (rightClicks < 8) { // limit to 8 dots on the right side
          this.blindSpotRight.push(clickPosition)
          rightClicks++
          this.renderDots()
        }
      }
    })

    this.leftButton.addEventListener('click', () => {
      if (this.blindSpotLeft.length === 8 && !this.leftPolygon) { // Only generate polygon if 8 dots have been added on the left side and polygon has not been generated
        this.leftPolygon = this.generatePolygon(this.blindSpotLeft)
        this.renderPolygon(this.leftPolygon!, this.polygonColor)
        this.leftPolygonArea.innerHTML = `<b>Left eye area: </b>${this.calculateArea(this.blindSpotLeft)} cm2`
        this.leftDotDistance.innerHTML = `<b>Left eye distance: </b>${this.calculateDistance(this.blindSpotLeft[0], this.stimulusPosition)} cm`
        this.saveState()
      }
    })

    this.rightButton.addEventListener('click', () => {
      if (this.blindSpotRight.length === 8 && !this.rightPolygon) {
        this.rightPolygon = this.generatePolygon(this.blindSpotRight)
        this.renderPolygon(this.rightPolygon!, this.polygonColor)
        this.rightPolygonArea.innerHTML = `<b>Right eye area: </b>${this.calculateArea(this.blindSpotRight)} cm2`
        this.rightDotDistance.innerHTML = `<b>Right eye distance: </b>${this.calculateDistance(this.blindSpotRight[0], this.stimulusPosition)} cm`
        this.saveState()
      }
    })

    this.resetButton.addEventListener('click', () => {
      leftClicks = 0
      rightClicks = 0
      this.blindSpotLeft = []
      this.blindSpotRight = []
      this.leftPolygon = null
      this.rightPolygon = null
      this.renderDots()
      this.saveState()
    })
  }

  calculateDistance (position1: Point, position2: Point): string {
    const pixelsPerCm = 38
    const dx = position2.x - position1.x
    const dy = position2.y - position1.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return (distance / pixelsPerCm).toFixed(2)
  }

  calculateArea (points: Point[]): number {
    let area = 0
    const n = points.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      area += (points[j].x * 0.02645833 - points[i].x * 0.02645833) * (points[j].y * 0.02645833 + points[i].y * 0.02645833)
    }
    return Math.round(Math.abs(area / 2) * 100) / 100
  }

  isLeftSide (position: Point): boolean {
    return position.x < this.stimulusPosition.x
  }

  generatePolygon (points: Point[]): Path2D | null {
    const polygon = new Path2D()
    if (points.length > 0) {
      polygon.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        polygon.lineTo(points[i].x, points[i].y)
      }
      polygon.closePath()
      return polygon
    }
    return null
  }

  renderDots (): void {
    this.clearCanvas()
    this.drawStimulus()
    this.blindSpotLeft.forEach(dot => this.drawDot(dot.x, dot.y))
    this.blindSpotRight.forEach(dot => this.drawDot(dot.x, dot.y))
    if (this.leftPolygon) {
      this.renderPolygon(this.leftPolygon, this.polygonColor)
    }
    if (this.rightPolygon) {
      this.renderPolygon(this.rightPolygon, this.polygonColor)
    }
  }

  renderPolygon (polygon: Path2D, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.fill(polygon)
  }

  fillCurrentCanvas (): void {
    this.renderDots()
    if (this.leftPolygon) {
      this.leftPolygonArea.innerHTML = `<b>Left eye area: </b>${this.calculateArea(this.blindSpotLeft)} cm2`
      this.leftDotDistance.innerHTML = `<b>Left eye distance: </b>${this.calculateDistance(this.blindSpotLeft[0], this.stimulusPosition)} cm`
    }
    if (this.rightPolygon) {
      this.rightPolygonArea.innerHTML = `<b>Right eye area: </b>${this.calculateArea(this.blindSpotRight)} cm2`
      this.rightDotDistance.innerHTML = `<b>Right eye distance: </b>${this.calculateDistance(this.blindSpotRight[0], this.stimulusPosition)} cm`
    }
  }

  saveState (): void {
    const state: BlindSpotState = {
      blindSpotLeft: this.blindSpotLeft,
      blindSpotRight: this.blindSpotRight,
      leftPolygon: this.leftPolygon,
      rightPolygon: this.rightPolygon
    }
    const patientsStore = usePatientsStore()
    const blindSpotMappingState: Partial<Patient> = {
      blindSpot: {
        [this.id as keyof BlindSpot]: JSON.stringify(state)
      }
    }
    patientsStore.updatePatient(blindSpotMappingState)
  }

  loadState (): void {
    const patientsStore = usePatientsStore()
    const blindSpotStateString = patientsStore.currentPatient?.blindSpot?.[this.id as keyof BlindSpot]
    if (blindSpotStateString) {
      const blindSpotState: BlindSpotState = JSON.parse(blindSpotStateString)
      this.blindSpotLeft = blindSpotState.blindSpotLeft
      this.blindSpotRight = blindSpotState.blindSpotRight
      this.leftPolygon = blindSpotState.leftPolygon ? this.generatePolygon(this.blindSpotLeft) : null
      this.rightPolygon = blindSpotState.rightPolygon ? this.generatePolygon(this.blindSpotRight) : null
      this.clearCanvas()
      this.drawStimulus()
      this.fillCurrentCanvas()
    }
  }
}

export default class DualBlindSpotMappingTest {
  private tests: BlindSpotMappingTest[]
  private readonly canvas1: HTMLCanvasElement
  private readonly canvas2: HTMLCanvasElement
  private leftButton1: HTMLElement
  private leftButton2: HTMLElement
  private rightButton1: HTMLElement
  private rightButton2: HTMLElement
  private resetButton1: HTMLElement
  private resetButton2: HTMLElement
  private readonly superposedCanvas: HTMLCanvasElement
  private superposedCanvasCtx: CanvasRenderingContext2D
  private readonly leftPolygonArea1: HTMLElement
  private readonly rightPolygonArea1: HTMLElement
  private readonly leftDotDistance1: HTMLElement
  private readonly rightDotDistance1: HTMLElement
  private readonly leftPolygonArea2: HTMLElement
  private readonly rightPolygonArea2: HTMLElement
  private readonly leftDotDistance2: HTMLElement
  private readonly rightDotDistance2: HTMLElement
  private readonly leftAreaDifference: HTMLElement
  private readonly rightAreaDifference: HTMLElement
  private readonly leftDistanceDifference: HTMLElement
  private readonly rightDistanceDifference: HTMLElement

  constructor (
    id1: string,
    id2: string,
    polygonColor1: string,
    polygonColor2: string,
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    leftButton1: HTMLElement,
    leftButton2: HTMLElement,
    rightButton1: HTMLElement,
    rightButton2: HTMLElement,
    resetButton1: HTMLElement,
    resetButton2: HTMLElement,
    leftPolygonArea1: HTMLElement,
    rightPolygonArea1: HTMLElement,
    leftDotDistance1: HTMLElement,
    rightDotDistance1: HTMLElement,
    leftPolygonArea2: HTMLElement,
    rightPolygonArea2: HTMLElement,
    leftDotDistance2: HTMLElement,
    rightDotDistance2: HTMLElement,
    leftAreaDifference: HTMLElement,
    rightAreaDifference: HTMLElement,
    leftDistanceDifference: HTMLElement,
    rightDistanceDifference: HTMLElement,
    superposedCanvas: HTMLCanvasElement
  ) {
    this.tests = [
      new BlindSpotMappingTest(canvas1, id1, polygonColor1, leftButton1, rightButton1, resetButton1, leftPolygonArea1, rightPolygonArea1, leftDotDistance1, rightDotDistance1),
      new BlindSpotMappingTest(canvas2, id2, polygonColor2, leftButton2, rightButton2, resetButton2, leftPolygonArea2, rightPolygonArea2, leftDotDistance2, rightDotDistance2)
    ]
    this.canvas1 = canvas1
    this.canvas2 = canvas2
    this.superposedCanvas = superposedCanvas
    this.leftButton1 = leftButton1
    this.leftButton2 = leftButton2
    this.rightButton1 = rightButton1
    this.rightButton2 = rightButton2
    this.resetButton1 = resetButton1
    this.resetButton2 = resetButton2
    this.leftPolygonArea1 = leftPolygonArea1
    this.rightPolygonArea1 = rightPolygonArea1
    this.leftDotDistance1 = leftDotDistance1
    this.rightDotDistance1 = rightDotDistance1
    this.leftPolygonArea2 = leftPolygonArea2
    this.rightPolygonArea2 = rightPolygonArea2
    this.leftDotDistance2 = leftDotDistance2
    this.rightDotDistance2 = rightDotDistance2
    this.leftAreaDifference = leftAreaDifference
    this.rightAreaDifference = rightAreaDifference
    this.leftDistanceDifference = leftDistanceDifference
    this.rightDistanceDifference = rightDistanceDifference
    this.superposedCanvasCtx = superposedCanvas.getContext('2d') as CanvasRenderingContext2D
    this.renderSuperposedCanvas()
    this.setupEventListeners()
    this.updateDifferenceText()
  }

  private setupEventListeners (): void {
    this.leftButton1.addEventListener('click', () => {
      this.updateDifferenceText()
      this.renderSuperposedCanvas()
    })

    this.rightButton1.addEventListener('click', () => {
      this.updateDifferenceText()
      this.renderSuperposedCanvas()
    })

    this.leftButton2.addEventListener('click', () => {
      this.updateDifferenceText()
      this.renderSuperposedCanvas()
    })

    this.rightButton2.addEventListener('click', () => {
      this.updateDifferenceText()
      this.renderSuperposedCanvas()
    })

    this.resetButton1.addEventListener('click', () => {
      this.updateDifferenceText()
      this.renderSuperposedCanvas()
    })

    this.resetButton2.addEventListener('click', () => {
      this.updateDifferenceText()
      this.renderSuperposedCanvas()
    })
  }

  private renderSuperposedCanvas (): void {
    this.superposedCanvasCtx.clearRect(0, 0, this.superposedCanvas.width, this.superposedCanvas.height)

    // Draw the first canvas onto the superposed canvas.
    this.superposedCanvasCtx.globalAlpha = 0.5
    this.superposedCanvasCtx.drawImage(this.canvas1, 0, 0)

    // Draw the second canvas onto the superposed canvas.
    this.superposedCanvasCtx.globalAlpha = 0.5
    this.superposedCanvasCtx.drawImage(this.canvas2, 0, 0)
  }

  private updateDifferenceText (): void {
    if (
      this.leftPolygonArea1.textContent &&
      this.leftPolygonArea2.textContent
    ) {
      const leftArea1 = parseFloat(this.leftPolygonArea1.textContent.split(': ')[1])
      const leftArea2 = parseFloat(this.leftPolygonArea2.textContent.split(': ')[1])
      const areaDiff = Math.abs(leftArea1 - leftArea2).toFixed(2)
      this.leftAreaDifference.innerHTML = `<b>Left Area difference: </b>${areaDiff} cm2`
    }

    if (
      this.rightPolygonArea1.textContent &&
      this.rightPolygonArea2.textContent
    ) {
      const leftArea1 = parseFloat(this.rightPolygonArea1.textContent.split(': ')[1])
      const leftArea2 = parseFloat(this.rightPolygonArea2.textContent.split(': ')[1])
      const areaDiff = Math.abs(leftArea1 - leftArea2).toFixed(2)
      this.rightAreaDifference.innerHTML = `<b>Right Area difference: </b>${areaDiff} cm2`
    }

    if (
      this.leftDotDistance1.textContent &&
      this.leftDotDistance2.textContent
    ) {
      const leftDistance1 = parseFloat(this.leftDotDistance1.textContent.split(': ')[1])
      const leftDistance2 = parseFloat(this.leftDotDistance2.textContent.split(': ')[1])
      const distanceDiff = Math.abs(leftDistance1 - leftDistance2).toFixed(2)
      this.leftDistanceDifference.innerHTML = `<b>Left Distance difference: </b>${distanceDiff} cm`
    }

    if (
      this.rightDotDistance1.textContent &&
      this.rightDotDistance2.textContent
    ) {
      const leftDistance1 = parseFloat(this.rightDotDistance1.textContent.split(': ')[1])
      const leftDistance2 = parseFloat(this.rightDotDistance2.textContent.split(': ')[1])
      const distanceDiff = Math.abs(leftDistance1 - leftDistance2).toFixed(2)
      this.rightDistanceDifference.innerHTML = `<b>Right Distance difference: </b>${distanceDiff} cm`
    }
  }

  async exportPDF (): Promise<void> {
    useTrackEvent('export-blindspot-pdf')
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('l', 'mm', 'a4')

    const exportCanvas = async (
      canvas: HTMLCanvasElement,
      xOffset: number,
      yOffset = 10
    ): Promise<void> => {
      const canvasImage = await html2canvas(canvas)
      const imageDataUrl = canvasImage.toDataURL('image/jpeg', 1.0)

      doc.addImage(imageDataUrl, 'JPEG', xOffset, yOffset, 270, 270 * (canvas.height / canvas.width))
    }

    const pages = [{
      canvas: this.canvas1,
      title: 'Before',
      leftArea: this.leftPolygonArea1.textContent,
      rightArea: this.rightPolygonArea1.textContent,
      leftDistance: this.leftDotDistance1.textContent,
      rightDistance: this.rightDotDistance1.textContent,
      addPage: true
    },
    {
      canvas: this.canvas2,
      title: 'After',
      leftArea: this.leftPolygonArea2.textContent,
      rightArea: this.rightPolygonArea2.textContent,
      leftDistance: this.leftDotDistance2.textContent,
      rightDistance: this.rightDotDistance2.textContent,
      addPage: true
    },
    {
      canvas: this.superposedCanvas,
      title: 'Final comparison',
      leftArea: this.leftAreaDifference.textContent,
      rightArea: this.rightAreaDifference.textContent,
      leftDistance: this.leftDistanceDifference.textContent,
      rightDistance: this.rightDistanceDifference.textContent
    }]

    const textYOffset = 160

    doc.setFontSize(24)
    const titleWidth = doc.getStringUnitWidth('Blind Spot Mapping') * doc.getFontSize() / doc.internal.scaleFactor
    const titleXOffset = (doc.internal.pageSize.getWidth() - titleWidth) / 2
    doc.setTextColor(105, 162, 151)
    doc.text('Blind Spot Mapping', titleXOffset, 16)
    doc.setTextColor(0)
    doc.setFontSize(12)
    doc.text('This blind spot is like a small area where you can\'t see things. It Looks at how your brain does clever tricks to fill in this missing information, sometimes creating optical illusions. It gives us information  about how flexible your nervous system is and how your brain can change and adapt on both sides. It\'s like your brain\'s way of being smart and making sure you can see things even when there\'s a gap. It gives us information about your nervous system adaptability and how it is functioning  and your brain plasticity!\n\nIt is not about seeing right , it is about having a nervous system functioning at its higher function!', 10, 40, { maxWidth: 280 })
    doc.addPage()
    doc.setFontSize(24)

    for (const [_pageIndex, page] of pages.entries()) {
      await exportCanvas(page.canvas, 10, 40)

      doc.setDrawColor(105, 162, 151) // Set border color to red
      doc.setFillColor(255, 255, 255) // Set fill color to white
      doc.setLineWidth(0.5) // Set border width

      doc.setTextColor(71, 71, 71)
      doc.setFontSize(16)
      doc.text(page.title, 10, 30)

      doc.setFontSize(12)
      doc.text(`${page.leftArea}`, 10, textYOffset)
      doc.text(`${page.rightArea}`, 10, textYOffset + 6)
      doc.text(`${page.leftDistance}`, 10, textYOffset + 12)
      doc.text(`${page.rightDistance}`, 10, textYOffset + 18)

      if (page.addPage) {
        doc.addPage()
      }
    }

    doc.save('blind_spot_mapping_test.pdf')
  }
}
