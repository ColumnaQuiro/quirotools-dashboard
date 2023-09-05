import { defineStore } from 'pinia'
import { Ref } from 'vue'

export type PostureKey = 'left' | 'right'

export interface Posture {
  canvas: any
  imageUrl: any
}

export type Postures = {
  [key in PostureKey]?: Posture
}
export const usePostureAnalysisStore = defineStore('posture-analysis', () => {
  const postures: Ref<Postures> = ref({
    left: undefined,
    right: undefined
  })

  return {
    postures
  }
})
