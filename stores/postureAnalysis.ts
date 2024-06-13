import { defineStore, type StateTree } from 'pinia'

export type PostureKey = 'left' | 'right'

export interface Posture {
  canvas: any
  imageUrl: any
}

export type Postures = {
  [key: string]: {
    [key in PostureKey]?: Posture
  }
}

interface State {
  postures: Postures
}

interface Getters extends StateTree {}
interface Actions {}

export const usePostureAnalysisStore = defineStore<'posture-analysis', State, Getters, Actions>('posture-analysis', {
  state: () => ({
    postures: {}
  })
})
