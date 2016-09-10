import hash from 'string-hash'

const findLink = (hash, data) => data.filter(l => l.id === hash)[0]

const addHash = ({ prompt, answers }) => { return {id: hash(prompt), prompt, answers} }

const createLink = ({ answers }, data) => answers.forEach(a => {
  let isPath = a.next.match(/^\//) ? true : false
  let isGIF = a.next.match(/gif/) ? true : false
  a.next = isPath || isGIF ? a.next : findLink(hash(a.next), data)
})

export const createStore = (questions) => {
  const res = []

  questions.forEach(q => res.push(addHash(q)))
  res.forEach(q => createLink(q, res))

  return res
}
