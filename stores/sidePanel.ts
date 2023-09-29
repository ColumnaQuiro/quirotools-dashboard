import { defineStore, StateTree } from 'pinia'

interface State {
  sidePanelWidth: number
}

interface Getters extends StateTree {}
interface Actions {}

export const useSidePanelStore = defineStore<'sidePanel', State, Getters, Actions>('sidePanel', {
  state: () => ({
    sidePanelWidth: 0
  })
})
