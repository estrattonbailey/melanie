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
  const toggle = document.getElementById('toggle')
  const menu = document.getElementById('menu')

  const menuToggle = (close) => {
    const open = menu.classList.contains('is-visible')
    menu.classList[open || close ? 'remove' : 'add']('is-visible')
    toggle.classList[open || close ? 'remove' : 'add']('is-active')
  }

  toggle.addEventListener('click', e => {
    menuToggle()
  })

  app()

  router.on('route:after', ({ route }) => {
    colors.update()

    if (/contact/.test(route)) {
      contact()
    }

    menuToggle(true)
  })

  if (/contact/.test(window.location.pathname)) {
    contact()
  }

  colors.update()
})
