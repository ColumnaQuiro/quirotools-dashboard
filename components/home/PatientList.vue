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
import { Ref } from 'vue'
import { usePatientsStore } from '~/stores/patients'
import { Patient } from '~/types/patient'

interface SelectableItem {
  value: any;
  selectable: boolean;
}

interface GroupableItem<T = any> {
  type: 'item';
  raw: T;
}

interface DataTableItem<T = any> extends GroupableItem<T>, SelectableItem {
  key: any;
  index: number;
  columns: {
    [key: string]: any;
  };
}

const emit = defineEmits(['createNewPatient'])
const itemsPerPage: Ref<number> = ref(5)
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Last Name', key: 'lastName' }
]
const patientsStore = usePatientsStore()
const { patients, isLoading } = storeToRefs(patientsStore)
const goToPatient = (_event: Event, { item: patient }: {item: DataTableItem<Patient>}) => {
  const { push } = useRouter()
  push(`/patients/${patient.raw.uid}`)
}
</script>
