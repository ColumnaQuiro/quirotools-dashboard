import { defineStore, StateTree } from 'pinia'

interface State {
  sidePanelWidth: numbner
}

interface Getters extends StateTree {}
interface Actions {}

export const useSidePanelStore = defineStore<'sidePanel', State, Getters, Actions>('sidePanel', {
  state: () => ({
    sidePanelWidth: 0
  })
})
