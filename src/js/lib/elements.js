import h0 from 'h0'

export const div = h0('div')
export const button = h0('button')({class: 'link mv05 mr1 inline-block'})
export const title = h0('h1')({class: 'h2'})

export const template = ({prompt, answers}, cb) => {
  return div({class: 'pv2 ph2 h2'})(
    title(prompt),
    div({class: 'mt1'})(
      ...answers.map(a => button({
        onclick: (e) => cb(a.next)
      })(a.value))
    )
  )
}
