import { defineStore } from 'pinia'
import { Ref } from 'vue'

export const useSidePanelStore = defineStore('sidePanel', () => {
  const sidePanelWidth:Ref<number> = ref(0)

  return {
    sidePanelWidth
  }
})
