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
  css: [
    'vuetify/styles',
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
    }
  ],
  build: {
    transpile: ['vuetify']
  }
})
