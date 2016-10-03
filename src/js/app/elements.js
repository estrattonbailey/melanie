import h0 from 'h0'

export const div = h0('div')
export const button = h0('button')({class: 'h2 mv0 inline-block'})
export const title = h0('h1')({class: 'mt0'})

export const template = ({prompt, answers}, cb) => {
  return div({class: 'question'})(
    title(prompt),
    div(
      ...answers.map((a, i) => button({
        onclick: (e) => cb(a.next),
        style: {
          color: window.__app.colors[i]
        }
      })(a.value))
    )
  )
}
