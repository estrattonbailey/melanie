import h0 from 'h0'

export const div = h0('div')
export const button = h0('a')({class: 'h1 mv05 mr1 inline-block'})
export const title = h0('h1')

export const template = ({prompt, answers}, cb) => {
  return div(
    title(prompt),
    div(
      ...answers.map(a => button({
        onclick: (e) => cb(a.next)
      })(a.value))
    )
  )
}
