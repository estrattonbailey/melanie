import React from 'react'

import Main from '../components/Main.js'
import Foot from '../components/Foot.js'
import PageHeader from '../components/PageHeader.js'

export default props => {
  const { title, subtitle, description } = props.pages.about

  return (
    <Main {...props}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        description={description}/>

      <div className="container--m mha">
        <div className="pv05 ts2 clear">
          {props.locals.images.map((img, i) => (
            <ProjectImage key={i} image={img}/>
          ))}
        </div>
      </div>
      <Foot {...props}/>
    </Main>
  )
}
