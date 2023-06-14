import type { Handler, HandlerEvent } from '@netlify/functions'
import admin from 'firebase-admin'

const handler: Handler = async (event: HandlerEvent) => {
  const data = JSON.parse(event.body || '')

  if (data.type === 'checkout.session.completed') {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string))
    })
    const subscriptionData = data.data.object

    const { client_reference_id: userId, status, customer } = subscriptionData
    if (status === 'complete') {
      const db = admin.firestore()
      const collection = db.collection('chiropractors')
      await collection.doc(userId).set({ hasPaid: true, stripeCustomerId: customer }, { merge: true })
    }
  }

  return {
    statusCode: 200
  }
}

export { handler }
