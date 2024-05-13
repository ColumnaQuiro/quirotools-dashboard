<template>
  <fwb-modal size="md" @close="onCloseDialog">
    <template #body>
      <div class="font-medium">
        Are you sure you want to delete the patient?
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center">
        <ct-components-button
          size="sm"
          class="mr-4"
          @click="emit('close')"
        >
          Cancel
        </ct-components-button>
        <ct-components-button
          size="sm"
          color="red"
          @click="deletePatient"
        >
          Delete
        </ct-components-button>
      </div>
    </template>
  </fwb-modal>
</template>
<script setup lang="ts">
import { FwbModal } from 'flowbite-vue'
import { usePatientsStore } from '~/stores/patients'

const props = defineProps({
  patientId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])
const patientStore = usePatientsStore()

const deletePatient = async () => {
  const { replace } = useRouter()
  await patientStore.deletePatient(props.patientId)
  useTrackEvent('patient-deleted')
  await replace('/')
}

const onCloseDialog = () => {
  emit('close')
}
</script>
