<template>
  <div>
    <div class="text-3xl pb-6">
      {{ currentPatient?.name }}
      {{ currentPatient?.lastName }}
    </div>
    <ct-components-blind-spot />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePatientsStore } from '~/stores/patients'

definePageMeta({
  middleware: ['auth']
})

const { params } = useRoute()
const patientId = params.id as string
const patientsStore = usePatientsStore()
const { currentPatient } = storeToRefs(patientsStore)
onMounted(() => {
  patientsStore.setCurrentPatient(patientId)
})
</script>
