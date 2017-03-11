import layzr from 'layzr.js'
import operator from 'operator.js'

/**
 * Send page views to 
 * Google Analytics
 */
const gaTrackPageView = (path, title) => {
  let ga = window.ga ? window.ga : false

  if (!ga) return

  ga('set', {page: path, title: title});
  ga('send', 'pageview');
}

const images = layzr({})
images.update().check()
window.images = images

const app = operator({
  root: '#root'
})

app.on('route:after', ({ route, title }) => {
  gaTrackPageView(route, title)
  images.update().check()
})

app.on('transition:after', () => loader && loader.end())

window.app = app

export default app
