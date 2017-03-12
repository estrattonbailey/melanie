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

const app = operator({
  root: '#root'
})

app.on('route:after', ({ route, title }) => {
  gaTrackPageView(route, title)
})

app.on('transition:after', () => loader && loader.end())

window.app = app

export default app
