import { defineStore } from 'pinia'
import { Ref } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { Chiropractor } from '~/types/chiropractor'
import { ERRORS } from '~/constants/errors'

export const useChiropractorStore = defineStore('chiropractor', () => {
  const db = useFirestore()
  const chiropractor: Ref<Chiropractor | null> = ref(null)

  async function fetchChiropractor () {
    const userId = useCurrentUser()?.value?.uid
    if (!userId) {
      throw new Error(ERRORS.USER_NOT_LOGGED_IN)
    }
    const chiroDocRef = doc(db, 'chiropractors', userId)
    const currentChiro = await getDoc(chiroDocRef)
    chiropractor.value = currentChiro.data() as Chiropractor
  }
  async function updateChiropractor (chiropractor: Partial<Chiropractor>) {
    const userId = useCurrentUser()?.value?.uid
    if (!userId) {
      throw new Error(ERRORS.USER_NOT_LOGGED_IN)
    }
    const chiroDocRef = doc(db, 'chiropractors', userId)
    await setDoc(chiroDocRef, chiropractor, { merge: true })
    await fetchChiropractor()
  }

  return { chiropractor, updateChiropractor, fetchChiropractor }
})
