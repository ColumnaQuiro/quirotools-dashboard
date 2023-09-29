// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://statics.columnaquiro.com' }
      ],
      script: [
        { type: 'text/javascript', id: 'hs-script-loader', async: true, defer: true, src: '//js-eu1.hs-scripts.com/143268808.js' }
      ]
    }
  },
  nitro: {
    preset: 'netlify'
  },
  css: [
    '~/assets/scss/main.scss'
  ],
  modules: [
    '@nuxtjs/critters',
    'nuxt-gtag',
    'nuxt-vuefire',
    '@pinia/nuxt'
  ],
  gtag: {
    id: 'G-5Q1NTT78VS'
  },
  vuefire: {
    auth: true,
    admin: {
      serviceAccount: JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT as string
      )
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    }
  },
  vuetify: {
    moduleOptions: {
      importComposables: false
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      stripeSubscriptionProductId: process.env.NODE_ENV === 'development' ? 'price_1NH9aXKNYpQIrO5VQB6v30mV' : 'price_1Np6tNKNYpQIrO5VTdw4Vcbs',
      baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://dashboard.chiro-tools.com/'
    }
  },
  experimental: {
    inlineSSRStyles: false
  },
  sourcemap: {
    server: false,
    client: false
  },
  vite: {
    optimizeDeps: {
      exclude: [
        'fsevents'
      ]
    }
  }
})
