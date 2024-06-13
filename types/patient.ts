export type Position = {
  x: number
  y: number
}

export type BlindSpotState = {
  blindSpotLeft: Position[]
  blindSpotRight: Position[]
  leftPolygon: Path2D | null
  rightPolygon: Path2D | null
}

export type PostureAnalysisState = {
  imageUrl: string
  canvasDataUrl: string
  verticalDots: Position[]
  horizontalDots: Position[]
  horizontalPairs: Position[][]
}

export type BlindSpot = {
  [key: string]: string
}

export type PostureAnalysisKey = 'left' | 'right'

export type PostureAnalysis = {
  [key: string]: {
    [key in PostureAnalysisKey]?: string
  }
}

export type PostureCanvas = {
  [key: string]: {
    [key in PostureAnalysisKey]?: HTMLCanvasElement
  }
}

export interface Patient {
  uid?: string
  name: string
  lastName: string
  blindSpot?: BlindSpot
  postureAnalysis?: PostureAnalysis
  postureCanvas?: PostureCanvas
}
