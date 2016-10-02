import router from '../lib/router'
import questions from './data/test'
import storage from './data'
import { template } from './elements'

let prev
const questionRoot = document.getElementById('questionRoot')
const data = storage(questions)

const update = (next) => {
  let isPath = typeof next === 'string' && next.match(/^\//) ? true : false
  if (isPath) return router.go(next)

  if (prev) questionRoot.removeChild(prev)

  prev = render(next)

  router.push(`#${next.id}`)
}

const render = (next) => {
  let el = template(next, update)
  questionRoot.appendChild(el)
  return el 
}

window.addEventListener('popstate', e => {
  update(data.getActive())
})

export default () => {
  prev = render(data.getActive())
}
