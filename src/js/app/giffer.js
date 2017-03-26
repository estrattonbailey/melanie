import { tarry, queue } from 'tarry.js'

export default () => {
  let loaded = false

  const modal = document.getElementById('gif')
  const img = modal.getElementsByTagName('img')[0]

  const lazy = (url, cb) => {
    let burner = document.createElement('img')

    burner.onload = () => cb(url)

    burner.src = url
  }

  const open = url => {
    window.loader.start()
    window.loader.putz(500)

    modal.style.display = 'block'

    lazy(url, url => {
      loaded = true
      img.src = url
      img.style.display = 'block'
      window.loader.end()
    })
  }

  const close = () => {
    loaded = false
    modal.style.display = 'none'
    img.style.display = 'none'
  }

  modal.onclick = () => loaded ? close() : null

  return {
    open,
    close
  }
}
