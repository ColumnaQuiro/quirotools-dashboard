<template>
  <div>
    <div class="text-3xl pb-6">
      {{ currentPatient?.name }}
      {{ currentPatient?.lastName }}
    </div>
    <div>
      <patients-page-button v-for="pageButton in pageButtons" v-bind="pageButton" :key="pageButton.key" />
    </div>
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

const pageButtons = [{
  key: 'blindSpot',
  iconPath: `${STATICS_CDN}icons/icon__eye.webp`,
  to: `${patientId}/blind-spot`,
  text: 'Blind Spot',
  background: 'bg-brand-light-tertiary'
}]
onMounted(() => {
  patientsStore.setCurrentPatient(patientId)
})
</script>
