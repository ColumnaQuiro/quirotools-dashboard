export interface StripeCheckoutItem {
  /**
   * The ID of the price that the customer would like to purchase. SKU or plan IDs may also be used.
   */
  price: string,
  /**
   * The quantity of units for the item.
   */
  quantity: number
}

export type PaymentMode = 'payment' | 'subscription' | undefined
