type Point = { x: number; y: number };

export default class BlindSpotMappingTest {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private stimulusPosition: Point
  private blindSpotLeft: Point[]
  private blindSpotRight: Point[]

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.stimulusPosition = { x: this.canvas.width / 2, y: this.canvas.height / 2 }
    this.blindSpotLeft = []
    this.blindSpotRight = []
    this.setupEventListeners()
  }

  drawStimulus (): void {
    this.clearCanvas()
    const lineY = this.canvas.height / 2
    this.ctx.beginPath()
    this.ctx.moveTo(50, lineY)
    this.ctx.lineTo(950, lineY)
    this.ctx.stroke()
    this.drawDot(this.stimulusPosition.x, this.stimulusPosition.y, 'black', 5)
  }

  drawDot (x: number, y: number, color = 'black', size = 3): void {
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
    })

    document.querySelector('#left-button')!.addEventListener('click', () => {
      if (leftClicks === 8) { // only generate polygon if 8 dots have been added on the left side
        const leftPolygon = this.generatePolygon(this.blindSpotLeft)
        this.renderPolygon(leftPolygon!, 'rgba(255, 0, 0, 0.5)')
        document.querySelector('#left-area')!.textContent = `Left area: ${this.calculateArea(this.blindSpotLeft)} cm2`
        document.querySelector('#left-distance')!.textContent = `Distance from stimulus: ${this.calculateDistance(this.blindSpotLeft[0], this.stimulusPosition)} cm`
      }
    })

    document.querySelector('#right-button')!.addEventListener('click', () => {
      if (rightClicks === 8) { // only generate polygon if 8 dots have been added on the right side
        const rightPolygon = this.generatePolygon(this.blindSpotRight)
        this.renderPolygon(rightPolygon!, 'rgba(0, 255, 0, 0.5)')
        document.querySelector('#right-area')!.textContent = `Right area: ${this.calculateArea(this.blindSpotRight)} cm2`
        document.querySelector('#right-distance')!.textContent = `Distance from stimulus: ${this.calculateDistance(this.blindSpotRight[0], this.stimulusPosition)} cm`
      }
    })

    document.querySelector('#reset-button')!.addEventListener('click', () => {
      leftClicks = 0
      rightClicks = 0
      this.blindSpotLeft = []
      this.blindSpotRight = []
      this.renderDots()
      document.querySelector('#left-area')!.textContent = ''
      document.querySelector('#right-area')!.textContent = ''
      document.querySelector('#left-distance')!.textContent = ''
      document.querySelector('#right-distance')!.textContent = ''
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
    this.blindSpotLeft.forEach(dot => this.drawDot(dot.x, dot.y, 'black', 3))
    this.blindSpotRight.forEach(dot => this.drawDot(dot.x, dot.y, 'black', 3))
  }

  renderPolygon (polygon: Path2D, color: string): void {
    this.ctx.fillStyle = color
    this.ctx.fill(polygon)
  }
}
