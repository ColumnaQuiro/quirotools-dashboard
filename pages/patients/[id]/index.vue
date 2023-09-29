<template>
  <div v-if="currentPatient">
    <div class="flex items-center pb-6">
      <div class="text-3xl">
        {{ currentPatient.name }}
        {{ currentPatient.lastName }}
      </div>
      <div class="pl-4">
        <ct-components-button
          size="xs"
          color="red"
          class="py-2 !rounded-3xl"
          @click="showDeletePatientDialog = true"
        >
          <svg class="w-[16px] h-[16px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
          </svg>
        </ct-components-button>
      </div>
    </div>
    <div class="flex flex-row gap-5 flex-wrap">
      <patients-page-button v-for="pageButton in pageButtons" v-bind="pageButton" :key="pageButton.key" />
    </div>
    <patients-delete-patient-dialog v-if="showDeletePatientDialog" :patient-id="patientId" @close="showDeletePatientDialog = false" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePatientsStore } from '~/stores/patients'
import { STATICS_CDN } from '~/constants/urls'

definePageMeta({
  middleware: ['auth']
})

const { params } = useRoute()
const patientId = params.id as string
const patientsStore = usePatientsStore()
const { currentPatient } = storeToRefs(patientsStore)

const pageButtons = [
  {
    key: 'blindSpot',
    iconPath: `${STATICS_CDN}icons/icon__eye.webp`,
    to: `${patientId}/blind-spot`,
    text: 'Blind Spot',
    background: 'bg-brand-light-tertiary'
  },
  {
    key: 'postureAnalysis',
    iconPath: `${STATICS_CDN}icons/icon__back-analisis.webp`,
    to: `${patientId}/posture-analysis`,
    text: 'Posture Analysis',
    background: 'bg-brand-light-tertiary'
  }
]

const showDeletePatientDialog = ref(false)

onMounted(() => {
  patientsStore.setCurrentPatient(patientId)
})
</script>
