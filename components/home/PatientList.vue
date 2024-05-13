<template>
  <div>
    <fwb-table hoverable>
      <fwb-table-head class="!bg-brand-light-white">
        <fwb-table-head-cell v-for="header in headers" :key="header.key">
          {{ header.title }}
        </fwb-table-head-cell>
        <fwb-table-head-cell><span class="sr-only">Edit</span></fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body>
        <fwb-table-row v-for="patient in paginatedPatients" :key="patient.name" @click="goToPatient(patient)">
          <fwb-table-cell>
            {{ patient.name }}
          </fwb-table-cell>
          <fwb-table-cell>
            {{ patient.lastName }}
          </fwb-table-cell>
          <fwb-table-cell />
          <!--          <table-cell>-->
          <!--            <a :href="`/patients/${patient.uid}`" class="font-medium text-brand-primary hover:underline">Edit</a>-->
          <!--          </table-cell>-->
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
    <fwb-pagination
      v-model="currentPage"
      class="mt-4"
      show-icons
      :per-page="patientsPerPage"
      :total-pages="patientsStore.patients.length/patientsPerPage + 1"
      :slice-length="4"
      :show-labels="false"
    />
  </div>
</template>

<script setup lang="ts">
import { FwbPagination, FwbTable, FwbTableHead, FwbTableBody, FwbTableHeadCell, FwbTableRow, FwbTableCell } from 'flowbite-vue'
import { usePatientsStore } from '~/stores/patients'
import { Patient } from '~/types/patient'

const currentPage = ref(1)
const patientsPerPage = 9
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Last Name', key: 'lastName' }
]
const patientsStore = usePatientsStore()
const paginatedPatients: Patient[] = computed(() => patientsStore.patients.slice((currentPage.value - 1) * patientsPerPage, currentPage.value * patientsPerPage))

const goToPatient = (patient: Patient) => {
  const { push } = useRouter()
  push(`/patients/${patient.uid}`)
}
</script>
