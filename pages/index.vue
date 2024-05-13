<template>
  <div class="h-full">
    <div class="text-2xl font-semibold text-center pb-8">
      Patients
    </div>
    <div v-if="!patientsStore.isLoading" class="rounded-2xl bg-white p-5 h-full">
      <div v-if="patientsStore.patients.length > 0">
        <div class="text-right pb-8">
          <ct-components-button @click="onCreatePatientButtonClicked">
            Create new patient
          </ct-components-button>
        </div>
        <home-patient-list @create-new-patient="onCreatePatientButtonClicked" />
      </div>
      <home-empty-state v-else @create-patient="onCreatePatientButtonClicked" />
    </div>
    <lazy-home-create-patient-dialog v-if="showCreatePatientDialog" @close-dialog="onCloseCreatePatientDialog" />
  </div>
</template>

<script setup lang="ts">
import { type Ref } from 'vue'
import { usePatientsStore } from '~/stores/patients'

definePageMeta({
  middleware: ['auth']
})

const patientsStore = usePatientsStore()

const showCreatePatientDialog: Ref<boolean> = ref(false)

const onCreatePatientButtonClicked = () => {
  showCreatePatientDialog.value = true
}

const onCloseCreatePatientDialog = () => {
  showCreatePatientDialog.value = false
}

</script>
