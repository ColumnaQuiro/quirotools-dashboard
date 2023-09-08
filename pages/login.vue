<template>
  <div class="flex items-center justify-center min-h-screen">
    <form class="md:w-[600px] w-full bg-white shadow-md rounded-2xl p-6 md:mx-0 mx-4" @submit.prevent="login">
      <div class="text-2xl text-brand-secondary text-center font-semibold pb-6">
        ChiroTools
      </div>
      <div class="mb-4">
        <div class="mb-4">
          <ct-components-input-text
            v-model="email"
            label="Email"
            placeholder="user@gmail.com"
            :rules="EMAIL_RULES"
            type="email"
            autocomplete="username"
          />
        </div>
      </div>
      <div class="mb-6">
        <ct-components-input-text
          v-model="password"
          label="Password"
          :rules="REQUIRED_RULE"
          type="password"
          autocomplete="current-password"
        />
      </div>
      <ct-components-button ref="blindSpotTopLeftButton" type="submit" color="secondary" class="mx-auto">
        Sign In
      </ct-components-button>
      <div class="text-center pt-4">
        <nuxt-link to="/create-account" class="text-sm text-gray-400 underline">
          Don't have an account yet? Create one
        </nuxt-link>
      </div>
      <div v-if="errorMessage" class="mt-4 text-red-500 text-sm">
        {{ errorMessage }}
      </div>
      <div class="flex justify-center items-end pt-8">
        <div class="text-sm text-brand-tertiary font-semibold pr-1">
          by
        </div>
        <div>
          <v-img :src="`${STATICS_CDN}logo/logo-color.webp`" :width="65" alt="ColumnaQuiro" class="mx-auto" />
        </div>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  UserCredential
} from '@firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { STATICS_CDN } from '~/constants/urls'
import { EMAIL_RULES, REQUIRED_RULE } from '~/constants/form-rules'

definePageMeta({
  layout: 'login'
})

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const login = async () => {
  try {
    const auth = getAuth()
    await useFirebaseAuth()?.setPersistence(browserLocalPersistence)
    const user: UserCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    if (!user.user.emailVerified) {
      throw new Error('Your email is not verify. Please check you inbox to verify your email.')
    }
    await router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message
  }
}
</script>
