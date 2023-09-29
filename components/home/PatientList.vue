<template>
  <div>
    <Table hoverable>
      <table-head>
        <table-head-cell v-for="header in headers" :key="header.key">
          {{ header.title }}
        </table-head-cell>
        <table-head-cell><span class="sr-only">Edit</span></table-head-cell>
      </table-head>
      <table-body>
        <table-row v-for="patient in patients" :key="patient.name" @click="goToPatient(patient)">
          <table-cell>
            {{ patient.name }}
          </table-cell>
          <table-cell>
            {{ patient.lastName }}
          </table-cell>
          <table-cell>
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
          </table-cell>
        </table-row>
      </table-body>
    </Table>
    <Pagination v-model="currentPage" :total-pages="patients.length/10" :slice-length="4" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Pagination, Table, TableHead, TableBody, TableHeadCell, TableRow, TableCell } from 'flowbite-vue'
import { usePatientsStore } from '~/stores/patients'
import { Patient } from '~/types/patient'

const currentPage = ref(1)
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Last Name', key: 'lastName' }
]
const patientsStore = usePatientsStore()
const { patients } = storeToRefs(patientsStore)
const goToPatient = (patient: Patient) => {
  const { push } = useRouter()
  push(`/patients/${patient.uid}`)
}
</script>
