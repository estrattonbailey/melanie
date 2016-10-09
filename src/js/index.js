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

window.addEventListener('DOMContentLoaded', () => {
  app()

  const loader = putz(document.body, {
    speed: 100,
    trickle: 10
  })
  window.loader = loader
})
