/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        brand: {
          primary: '#8D5B4C',
          secondary: '#69A297',
          tertiary: '#F2B880',
          quaternary: '#E7CFBC',
          white: '#FFF4EC',
          black: '#474747'
        }
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      }
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif']
    }
  },
  plugins: []
}
