<template>
  <div class="flex items-center justify-center min-h-screen">
    <form class="md:w-[600px] w-full bg-white shadow-md rounded-2xl p-6 md:mx-0 mx-4" @submit.prevent="login">
      <div class="text-2xl text-brand-secondary text-center font-semibold pb-6">
        QuiroTools
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-bold mb-2">Email:</label>
        <input id="email" v-model="email" type="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Email">
      </div>
      <div class="mb-6">
        <label for="password" class="block text-sm font-bold mb-2">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading
tight focus:outline-none focus:shadow-outline"
          placeholder="Password"
        >
      </div>
      <ct-components-button ref="blindSpotTopLeftButton" type="submit" color="secondary" class="mx-auto">
        Sign In
      </ct-components-button>
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
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth'
import { LAYOUTS } from '~/constants/layouts'
import { STATICS_CDN } from '~/constants/urls'

definePageMeta({
  layout: LAYOUTS.LOGIN
})
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const login = async () => {
  try {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email.value, password.value)
    await router.push('/')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>
