import { defineStore, storeToRefs } from 'pinia'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { Ref } from 'vue'
import { useFirestore } from 'vuefire'
import { Patient } from '~/models/Patient'
import { useChiropractorStore } from '~/stores/chiropractor'
import { useUtils } from '~/composables/utils'

export const usePatientsStore = defineStore('patients', () => {
  const db = useFirestore()
  const patients:Ref<Patient[]> = ref([])
  const currentPatient:Ref<Patient | null> = ref(null)

  const getPatientById = computed(() => (id: string) => patients.value.find(patient => patient.id === id))

  async function fetchPatients () {
    patients.value = []
    const chiropractorStore = useChiropractorStore()
    const { chiropractor } = storeToRefs(chiropractorStore)
    const chiroPatients = chiropractor.value?.patients
    if (!chiroPatients) {
      return
    }
    const utils = useUtils()
    const chiroPatientsChunks = utils.chunkArray(chiroPatients, 10)
    for await (const snap of chiroPatientsChunks.map(
      async (chiroPatientsChunk) => {
        const patientsQuery = await query(collection(db, 'patients'), where('uid', 'in', chiroPatientsChunk))
        const patientsDocs = await getDocs(patientsQuery)
        return [...patientsDocs.docs.map((doc) => {
          return <Patient>{
            uid: doc.id,
            ...doc.data()
          } as Patient
        })]
      })) {
      patients.value = [...patients.value, ...snap]
    }
  }

  async function createPatient (patient: Patient) {
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
      await fetchPatients()
    } catch (e) {
      console.error(e)
    }
  }

  async function updatePatient (patient: Partial<Patient>, id: string | null = null) {
    const patientId = id || currentPatient.value?.uid
    const patientDocRef = patientId && doc(db, 'patients', patientId)
    patientDocRef && await setDoc(patientDocRef, patient, { merge: true })
  }

  function setCurrentPatient (id: string) {
    currentPatient.value = patients.value.find(patient => patient.uid === id) ?? null
  }

  return {
    patients,
    currentPatient,
    fetchPatients,
    createPatient,
    getPatientById,
    setCurrentPatient,
    updatePatient
  }
})
