import h0 from 'h0'
import navigo from 'navigo'
import questions from './data/test'
import { createStore } from './lib/data'
import { template } from './lib/elements'

const router = new navigo(window.location.origin)

const container = document.getElementById('app')

const DATA = createStore(questions)

let prev

const update = (next) => {
  let isPath = typeof next === 'string' && next.match(/^\//) ? true : false
  if (isPath) return router.navigate(next)

  if (prev) container.removeChild(prev)

  prev = render(next)

  router.navigate(`#${next.id}`)
}

const render = (next) => {
  let el = template(next, update)
  container.appendChild(el)
  return el 
}

window.addEventListener('DOMContentLoaded', () => {
  let curr = DATA.filter(q => q.id == window.location.hash.split(/#/)[1])[0]
  prev = render(curr ? curr : DATA[0])
})
