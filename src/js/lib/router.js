// import operator from 'operator.js'
import operator from '../../../../operator'
import putz from 'putz'

const loader = putz(document.body, {
  speed: 100,
  trickle: 20
})
window.loader = loader

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

const app = operator({
  root: '#root'
})

app.on('before:route', () => {
})

app.on('after:route', ({ route, title }) => {
  gaTrackPageView(route, title)
})

app.on('after:transition', () => loader.end())

export default app
