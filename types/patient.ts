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

export type BackPositionState = {
  imageUrl: string
  verticalDots: Position[]
  horizontalDots: Position[]
  horizontalPairs: Position[][]
}

export type BlindSpot = {
  [key: string]: string
}

export type BackPosition = {
  [key: string]: string
}

export interface Patient {
  uid?: string
  name: string
  lastName: string
  blindSpot?: BlindSpot
  backPosition?: BackPosition
}
