// import operator from 'operator.js'
import operator from '../../../../operator'

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

app.on('after:route', ({ route, title }) => {
  gaTrackPageView(route, title)
})

app.on('after:transition', () => loader && loader.end())

window.app = app

export default app
