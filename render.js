const path = require('path')
const fab = require('fab.js')
const data = require('./data.js')

const dir = process.cwd()

fab.output('./site')

fab.data(data)

fab.pages([
  {
    template: './src/markup/templates/Root.js',
    route: '/'
  },
  {
    template: './src/markup/templates/Work.js',
    route: 'work'
  }
])

data.projects.forEach(p => {
  fab.pages({
    template: './src/markup/templates/Project.js',
    route: p.url,
    locals: p
  })
})

fab.render()
