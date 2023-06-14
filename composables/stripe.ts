import { loadStripe, StripeError } from '@stripe/stripe-js'
import { Stripe } from '@stripe/stripe-js/types/stripe-js'
import { User } from '@firebase/auth'
import { PaymentMode, StripeCheckoutItem } from '~/types/stripe'

export const useStripe = () => {
  let stripe: Stripe | null
  onMounted(async () => {
    const config = useRuntimeConfig()
    stripe = await loadStripe(config.public.stripePublishableKey)
  })

  const openStripeCheckout = async (lineItems: StripeCheckoutItem[], successUrl: string, cancelUrl: string, mode: PaymentMode) => {
    if (!stripe) {
      throw new Error('Stripe is not properly initialized')
      return
    }
    const currentUser: User = await getCurrentUser()
    if (!currentUser) {
      throw new Error('User needs to be logged in')
      return
    }

    const { error }: {error: StripeError} = await stripe.redirectToCheckout({
      lineItems,
      mode,
      successUrl,
      cancelUrl,
      customerEmail: currentUser.email || undefined,
      clientReferenceId: currentUser.uid
    })

    if (error) {
      console.error(error)
    }
  }

  return {
    openStripeCheckout
  }
}
