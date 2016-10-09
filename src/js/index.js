import putz from 'putz'
import router from './lib/router'
import app from './app'

window.__app = {
  colors: [
    '#35D3E8',
    '#FF4E42',
    '#FFEA51'
  ]
}

const returnColor = () => __app.colors[Math.round(Math.random() * (2 - 0) + 0)]

const loader = window.loader = putz(document.body, {
  speed: 100,
  trickle: 10
})

window.addEventListener('DOMContentLoaded', () => {
  app()

  router.on('after:route', ({ route }) => {
    document.body.style.color = returnColor()
  })
})
