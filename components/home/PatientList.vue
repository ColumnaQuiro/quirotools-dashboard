<template>
  <div>
    <client-only>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :loading="isLoading && patients.length === 0"
        :headers="headers"
        :items="patients"
        :items-length="patients.length"
        height="300px"
        width="100%"
        @click:row="goToPatient"
      >
        <template #no-data>
          No patients created yet. <span class="underline cursor-pointer" @click="emit('createNewPatient')">Create new patient</span>
        </template>
      </v-data-table>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePatientsStore } from '~/stores/patients'
import { Patient } from '~/types/patient'

const emit = defineEmits(['createNewPatient'])
const itemsPerPage: Ref<number> = ref(5)
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Last Name', key: 'lastName' }
]
const patientsStore = usePatientsStore()
const { patients, isLoading } = storeToRefs(patientsStore)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const goToPatient = (event, { item: patient }: {item:Ref<Patient>}) => {
  const { push } = useRouter()
  push(`/patients/${patient.raw.uid}`)
}
</script>
