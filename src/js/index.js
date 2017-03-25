import putz from 'putz'
import router from './lib/router'
import app from './app'
import colors from './lib/colors'
import contact from './lib/contact'

const loader = window.loader = putz(document.body, {
  speed: 100,
  trickle: 10
})

window.addEventListener('DOMContentLoaded', () => {
  app()

  contact()

  router.on('route:after', ({ route }) => {
    colors.update()

    if (/contact/.test(route)) {
      contact()
    }
  })

  colors.update()
})
