<template>
  <div class="flex flex-col justify-center align-middle h-full">
    <div class="text-center">
      <Img :src="`${STATICS_CDN}icons/icon__user.webp`" alignment="mx-auto" size="w-20" />
      <div class="text-base text-gray-400 pt-6 pb-8">
        Oops, there are no patients created yet
      </div>
      <ct-components-button color="tertiary" @click="onCreatePatientClicked">
        Create new patient
      </ct-components-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Img } from 'flowbite-vue'
import { STATICS_CDN } from '~/constants/urls'

const emit = defineEmits(['createPatient'])

const onCreatePatientClicked = () => {
  emit('createPatient')
}
</script>
