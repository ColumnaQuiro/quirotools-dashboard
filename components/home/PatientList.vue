<template>
  <div>
    <client-only>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :loading="patients.length === 0"
        :headers="headers"
        :items="patients"
        :items-length="patients.length"
        height="300px"
        width="100%"
        @click:row="goToPatient"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePatientsStore } from '~/stores/patients'
import { Patient } from '~/types/patient'

const itemsPerPage = ref(5)
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Last Name', key: 'lastName' }
]
const patientsStore = usePatientsStore()
const { patients } = storeToRefs(patientsStore)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const goToPatient = (event, { item: patient }: {item:Ref<Patient>}) => {
  const { push } = useRouter()
  push(`/patients/${patient.raw.uid}`)
}
</script>

<style scoped>

</style>
