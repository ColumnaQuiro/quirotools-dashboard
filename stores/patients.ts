import { defineStore, StateTree } from 'pinia'
import {
  addDoc,
  collection, deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import type { Patient } from '~/types/patient'
import { useChiropractorStore } from '~/stores/chiropractor'
import { useUtils } from '~/composables/utils'

interface State {
  patients: Patient[]
  currentPatient?: Patient
  isLoading: boolean
}

interface Getters extends StateTree {
}

interface Actions {
  fetchPatients(): Promise<void>
  createPatient(patient: Patient): Promise<void>
  updatePatient(patient: Partial<Patient>, id?: string | null): Promise<void>
  deletePatient(patientId: string): Promise<void>
  setCurrentPatient(id: string): void
}

export const usePatientsStore = defineStore<'patients', State, Getters, Actions>('patients', {
  state: () => ({
    patients: [],
    currentPatient: undefined,
    isLoading: false
  }),
  actions: {
    async fetchPatients () {
      const db = useFirestore()
      this.isLoading = true
      this.patients = []
      const chiropractorStore = useChiropractorStore()
      const chiroPatients = chiropractorStore.chiropractor?.patients
      if (!chiroPatients) {
        return
      }
      const utils = useUtils()
      const chiroPatientsChunks = utils.chunkArray(chiroPatients, 10)
      for await (const snap of chiroPatientsChunks.map(
        async (chiroPatientsChunk) => {
          const patientsQuery = query(collection(db, 'patients'), where('uid', 'in', chiroPatientsChunk))
          const patientsDocs = await getDocs(patientsQuery)
          return [...patientsDocs.docs.map((doc) => {
            return <Patient>{
              uid: doc.id,
              ...doc.data()
            } as Patient
          })]
        })) {
        this.patients = [...this.patients, ...snap]
        this.isLoading = false
      }
    },
    async createPatient (patient) {
      const db = useFirestore()
      const patientCollection = collection(db, 'patients')
      const { chiropractor, updateChiropractor } = useChiropractorStore()
      const currentPatients = chiropractor?.patients || []
      try {
        const { id } = await addDoc(patientCollection, patient)
        await setDoc(doc(db, 'patients', id), { uid: id }, { merge: true })
        const patients = {
          patients: [...currentPatients, id]
        }
        await updateChiropractor(patients)
        await this.fetchPatients()
      } catch (e) {
        console.error(e)
      }
    },
    async updatePatient (patient: Partial<Patient>, id = null) {
      const db = useFirestore()
      const patientId = id || this.currentPatient?.uid
      const patientDocRef = patientId && doc(db, 'patients', patientId)
      patientDocRef && await setDoc(patientDocRef, patient, { merge: true })
    },
    async deletePatient (patientId) {
      const db = useFirestore()
      const patientDocRef = doc(db, 'patients', patientId)
      await deleteDoc(patientDocRef)
      this.patients = this.patients.filter(patient => patient.uid !== patientId)
    },
    setCurrentPatient (id) {
      this.currentPatient = this.patients.find(patient => patient.uid === id)
    }
  }
})
