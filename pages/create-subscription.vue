<template>
  <div class="flex items-center justify-center min-h-screen mx-6 md:mx-0">
    <div class="mx-auto text-center p-8 bg-white rounded-2xl md:w-[600px] w-full">
      <v-img :src="`${STATICS_CDN}icons/icon__time-expired.webp`" :width="50" alt="time expired" class="mx-auto mb-4" />
      <div class="text-2xl pb-8">
        Your free trial is over
      </div>
      <div class="text-base pb-4">
        We hope you enjoyed your free trial with us. We wanted to inform you that your trial period has come to an end,
        and in order to continue accessing our valuable services, we kindly ask you to subscribe.<br><br>
        To ensure uninterrupted usage, we offer a subscription plan at an affordable price of <span class="font-medium">only 11,95€</span> per month. By
        subscribing, you will regain full access to all the features and benefits our platform provides.
      </div>
      <ct-components-button color="secondary" @click="createSubscription">
        Subscribe
      </ct-components-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LAYOUTS } from '~/constants/layouts'
import { STATICS_CDN } from '~/constants/urls'
import { useStripe } from '~/composables/stripe'
import { StripeCheckoutItem } from '~/types/stripe'

definePageMeta({
  layout: LAYOUTS.LOGIN
})

const stripe = useStripe()

const createSubscription = () => {
  const config = useRuntimeConfig()
  const { baseURL, stripeSubscriptionProductId } = config.public
  const lineItems: StripeCheckoutItem[] = [
    { price: stripeSubscriptionProductId, quantity: 1 }
  ]
  stripe.openStripeCheckout(lineItems, `${baseURL}subscription-created`, `${baseURL}create-subscription`, 'subscription')
}
</script>
