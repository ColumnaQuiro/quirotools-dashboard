<template>
  <div>
    <div class="text-3xl pb-6">
      {{ patient?.name }}
      {{ patient?.lastName }}
    </div>
    <ct-components-blind-spot />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePatientsStore } from '~/stores/patients'

definePageMeta({
  middleware: ['auth']
})

const { params } = useRoute()
const patientId = params.id as string

const patientsStore = usePatientsStore()
patientsStore.setCurrentPatient(patientId)
const patient = patientsStore.currentPatient
</script>
