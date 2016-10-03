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
})
