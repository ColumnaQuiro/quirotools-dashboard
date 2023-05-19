// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0'
    }
  },
  nitro: {
    preset: 'netlify'
  },
  ssr: {
    noExternal: ['vuetify']
  },
  css: [
    'vuetify/styles',
    '~/assets/scss/main.css',
    '~/assets/scss/main.scss',
    '@mdi/font/css/materialdesignicons.css'
  ],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config =>
        config.plugins?.push(vuetify({
          autoImport: true,
          styles: { configFile: 'assets/scss/vuetify.scss' }
        })) as any
      )
    },
    'nuxt-vuefire',
    '@pinia/nuxt'
  ],
  vuefire: {
    auth: true,
    admin: {
      serviceAccount: './serviceAccount.json'
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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  build: {
    transpile: ['vuetify']
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
