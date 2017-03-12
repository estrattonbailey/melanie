import React from 'react'

import Main from '../components/Main.js'
import PageHeader from '../components/PageHeader.js'

export default props => {
  const { title, subtitle, description } = props.pages.about

  return (
    <Main {...props}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        description={description}/>
    </Main>
  )
}
