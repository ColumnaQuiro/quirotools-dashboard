<template>
  <form class="md:w-[600px] w-full bg-white shadow-md rounded-2xl p-6 md:mx-0 mx-4" @submit.prevent="login">
    <div class="text-2xl text-center font-semibold pb-6">
      Create Account
    </div>
    <div class="mb-4">
      <div class="mb-4">
        <ct-components-input-text
          v-model="email"
          label="Email"
          placeholder="user@gmail.com"
          :rules="EMAIL_RULES"
          type="email"
        />
      </div>
    </div>
    <div class="mb-6">
      <ct-components-input-text
        v-model="password"
        label="Password"
        :rules="REQUIRED_RULE"
        type="password"
      />
    </div>
    <ct-components-button
      ref="blindSpotTopLeftButton"
      type="submit"
      color="secondary"
      class="mx-auto"
      :disabled="creatingAccount"
    >
      Create account
    </ct-components-button>
    <div v-if="errorMessage" class="mt-4 text-red-500 text-sm">
      {{ errorMessage }}
    </div>
  </form>
</template>
<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth'
import { Ref } from 'vue'
import { EMAIL_RULES, REQUIRED_RULE } from '~/constants/form-rules'
import { useChiropractorStore } from '~/stores/chiropractor'
import { Chiropractor } from '~/types/chiropractor'

const emit = defineEmits(['onAccountCreated'])

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const creatingAccount: Ref<boolean> = ref(false)

const login = async () => {
  creatingAccount.value = false

  try {
    const auth = getAuth()
    const user = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await sendEmailVerification(user.user)
    await createChiropractor()
    const { gtag } = useGtag()
    gtag('set', 'user_id', user.user.uid)
    useTrackEvent('create-account', {
      method: 'Email'
    })
    emit('onAccountCreated')
  } catch (error: any) {
    useTrackEvent('create-account-error', {
      error: error.message
    })
    errorMessage.value = error.message
  } finally {
    creatingAccount.value = false
  }
}

const createChiropractor = async () => {
  const chiropractorStore = useChiropractorStore()
  const chiropractor: Chiropractor = {
    patients: [],
    hasPaid: false
  }
  await chiropractorStore.updateChiropractor(chiropractor)
}
</script>
