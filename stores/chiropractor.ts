import { defineStore, type StateTree } from 'pinia'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { type User } from '@firebase/auth'
import { useFirestore } from 'vuefire'
import { type Chiropractor } from '~/types/chiropractor'
import { ERRORS } from '~/constants/errors'

interface State {
  chiropractor?: Chiropractor
}

interface Getters extends StateTree {

}

interface Actions {
  fetchChiropractor(): Promise<void>
  updateChiropractor(chiropractor: Partial<Chiropractor>): Promise<void>
}

export const useChiropractorStore = defineStore<'chiropractor', State, Getters, Actions>('chiropractor', {
  state: () => ({
    chiropractor: undefined
  }),
  actions: {
    async fetchChiropractor () {
      const db = useFirestore()
      const user: User = await getCurrentUser()
      const userId = user?.uid
      if (!userId) {
        return
      }
      const chiroDocRef = doc(db, 'chiropractors', userId)
      const currentChiro = await getDoc(chiroDocRef)
      this.chiropractor = currentChiro.data() as Chiropractor
    },
    async updateChiropractor (chiropractor) {
      const db = useFirestore()
      const userId = useCurrentUser()?.value?.uid
      if (!userId) {
        throw new Error(ERRORS.USER_NOT_LOGGED_IN)
      }
      const chiroDocRef = doc(db, 'chiropractors', userId)
      await setDoc(chiroDocRef, chiropractor, { merge: true })
      await this.fetchChiropractor()
    }
  }

})
