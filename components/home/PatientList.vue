<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200">
      <UInput v-model="search" placeholder="Filter patients..." />
    </div>
    <UTable :rows="rows" :columns="columns" @select="goToPatient" />
    <div class="flex flex-wrap justify-between items-center">
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="patientsStore.patients.length"
        :ui="{
          wrapper: 'flex items-center gap-1',
          rounded: '!rounded-full min-w-[32px] justify-center',
          default: {
            activeButton: {
              variant: 'outline'
            }
          }
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { usePatientsStore } from '~/stores/patients'
import type { Patient } from '~/types/patient'

const search = ref('')
const page = ref(1)
const pageCount = 9
const columns = [
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Last Name', key: 'lastName', sortable: true }
]
const patientsStore = usePatientsStore()
const rows = computed(() => {
  const allPatients = patientsStore.patients || []
  const searchTerm = search.value?.toLowerCase() || ''

  let filteredPatients = allPatients
  if (searchTerm) { // If there is a search term, filter patients
    filteredPatients = allPatients.filter(patient =>
      Object.values(patient).some(value =>
        String(value).toLowerCase().includes(searchTerm)
      )
    )
  }

  // Apply pagination
  const start = (page.value - 1) * pageCount
  const end = page.value * pageCount
  return filteredPatients.slice(start, end)
})

const goToPatient = (patient: Patient) => {
  const { push } = useRouter()
  push(`/patients/${patient.uid}`)
}
</script>
