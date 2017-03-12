import React from 'react'

import Main from '../components/Main.js'
import ProjectImage from '../components/ProjectImage.js'
import PageHeader from '../components/PageHeader.js'

export default props => (
  <Main {...props}>
    <PageHeader
      title={props.locals.title}
      subtitle={props.locals.content.subtitle}
      description={props.locals.content.subsubtitle}
      projectFor={props.locals.content.projectFor}/>

    <div className="pv05 ts2 clear">
      {props.locals.images.map((img, i) => (
        <ProjectImage key={i} image={img}/>
      ))}
    </div>
  </Main>
)
