import lines from './subjectlines'

const touchSupport = !!(("ontouchstart" in window) || window.navigator && window.navigator.msPointerEnabled && window.MSGesture || window.DocumentTouch && document instanceof DocumentTouch)

if (touchSupport) {
  document.body.classList.add('touch')
}

const min = 0
const max = lines.length - 1
let current = 0

const copyToClipboard = msg => {
  try {
    const text = document.createElement('textarea')
    text.innerHTML = msg
    text.style.cssText = 'position: absolute; left: -9999px;'
    document.body.appendChild(text)
    text.select()
    document.execCommand('copy')
    text.blur()
    document.body.removeChild(text)
  } catch (err) {
    window.prompt('Press Cmd+C or Ctrl+C to copy to clipboard.', msg)
  }
}

function clamp(val){
  let _val

  if (val >= min && val <= max){
    _val = val 
  } else if (val >= max){
    _val = min
  } else if (val <= min){
    _val = max
  }

  return _val;
}

export default () => {
  const subject = document.getElementById('subjectLine')
  const next = document.getElementById('nextSubject')
  const prompt = document.getElementById('prompt')

  subject.innerHTML = lines[current]

  next.addEventListener('click', e => {
    e.preventDefault()

    prompt.innerHTML = '(click to copy)'
    current = clamp(++current)
    subject.innerHTML = lines[current]
    next.blur()
  })

  subject.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    if (touchSupport) return
    copyToClipboard(subject.innerHTML)
    prompt.innerHTML = 'copied!'
    return false
  })
}
