<template>
  <fwb-modal size="lg" @close="onCloseDialog">
    <template #header>
      <div class="text-2xl text-center">
        Create Patient
      </div>
    </template>
    <template #body>
      <form ref="createPatientForm" @submit.prevent="createPatient">
        <div class="flex gap-2">
          <ct-components-input-text
            v-model="name"
            label="First name*"
            required
            class="flex-1"
          />
          <ct-components-input-text
            v-model="lastName"
            label="Last name*"
            required
            class="flex-1"
          />
        </div>
        <div class="flex w-full justify-end pt-8">
          <ct-components-button
            class="mr-4"
            @click="onCloseDialog"
          >
            Close
          </ct-components-button>
          <ct-components-button
            type="submit"
          >
            Save
          </ct-components-button>
        </div>
      </form>
    </template>
  </fwb-modal>
</template>
<script setup lang="ts">
import { type Ref } from 'vue'
import { FwbModal } from 'flowbite-vue'
import { type Patient } from '~/types/patient'
import { usePatientsStore } from '~/stores/patients'

defineProps({
  openDialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['closeDialog'])

const patientsStore = usePatientsStore()

const createPatientForm: Ref<HTMLFormElement | null> = ref(null)
const name: Ref<string> = ref('')
const lastName: Ref<string> = ref('')

const createPatient = async () => {
  const patient: Patient = {
    name: name.value,
    lastName: lastName.value
  }
  await patientsStore.createPatient(patient)
  useTrackEvent('patient-created')
  name.value = ''
  lastName.value = ''
  onCloseDialog()
}

const onCloseDialog = () => {
  emit('closeDialog')
}

</script>
