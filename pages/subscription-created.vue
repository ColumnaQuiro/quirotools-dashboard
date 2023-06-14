<template>
  <div class="flex items-center justify-center min-h-screen mx-6 md:mx-0">
    <div class="mx-auto text-center p-8 bg-white rounded-2xl md:w-[600px] w-full">
      <v-img :src="`${STATICS_CDN}icons/icon__star.webp`" :width="50" alt="time expired" class="mx-auto mb-4" />
      <div class="text-2xl pb-8">
        Your subscription is created
      </div>
      <div class="text-base pb-4">
        We hope you continue enjoying our platform.
      </div>
      <ct-components-button color="secondary" to="/login">
        Login
      </ct-components-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LAYOUTS } from '~/constants/layouts'
import { STATICS_CDN } from '~/constants/urls'

definePageMeta({
  layout: LAYOUTS.LOGIN
})

</script>
