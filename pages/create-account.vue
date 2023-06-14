<template>
  <div class="flex items-center justify-center min-h-screen">
    <create-account-form v-if="!showSuccessfulMessage" @on-account-created="showSuccessfulMessage = true" />
    <div v-if="showSuccessfulMessage">
      <div class="text-xl text-center pb-3">
        ¡Your account has been created! 🎉<br>
        Check your inbox to verify you email.
      </div>
      <div class="text-base text-center">
        Go to <nuxt-link to="/login" class="font-medium">
          Login
        </nuxt-link> page
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LAYOUTS } from '~/constants/layouts'

definePageMeta({
  layout: LAYOUTS.LOGIN
})

const showSuccessfulMessage = ref(false)
</script>
