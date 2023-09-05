<template>
  <div>
    <div class="text-2xl font-semibold text-center pb-8">
      Patients
    </div>
    <div class="rounded-2xl bg-white p-5">
      <div class="text-right pb-8">
        <ct-components-button @click="onCreatePatientButtonClicked">
          Create new patient
        </ct-components-button>
      </div>
      <home-patient-list />
    </div>
    <client-only>
      <v-dialog
        v-model="openDialog"
        width="768"
      >
        <v-card>
          <v-card-title>
            <div class="text-2xl text-center">
              Create Patient
            </div>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="submit" @submit.prevent="createPatient">
              <div class="flex gap-2">
                <v-text-field
                  v-model="name"
                  :rules="REQUIRED_RULE"
                  label="First name*"
                />
                <v-text-field
                  v-model="lastName"
                  :rules="REQUIRED_RULE"
                  label="Last name*"
                />
              </div>
              <div class="flex w-full justify-end pt-4">
                <v-btn
                  variant="text"
                  @click="openDialog = false"
                >
                  Close
                </v-btn>
                <ct-components-button
                  type="submit"
                  variant="text"
                >
                  Save
                </ct-components-button>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { REQUIRED_RULE } from '~/constants/form-rules'
import { usePatientsStore } from '~/stores/patients'
import { Patient } from '~/types/patient'

definePageMeta({
  middleware: ['auth']
})

const openDialog: Ref<boolean> = ref(false)
const name: Ref<string> = ref('')
const lastName: Ref<string> = ref('')

const onCreatePatientButtonClicked = () => {
  openDialog.value = true
}
const createPatient = async () => {
  const patientsStore = usePatientsStore()
  const patient: Partial<Patient> = {
    name: name.value,
    lastName: lastName.value
  }
  await patientsStore.createPatient(patient)
  name.value = ''
  lastName.value = ''
  openDialog.value = false
}

</script>
