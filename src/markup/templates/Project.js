import React from 'react'

import Main from '../components/Main.js'
import ProjectImage from '../components/ProjectImage.js'

export default props => (
  <Main {...props}>
    <div className="container--s mha pv1 ts1">
      <h1 className="cb mv0">{props.locals.title}</h1>
      <p className="h3 mv05 cb light">{props.locals.content.subtitle}</p>
      <p className="cb">{props.locals.content.subsubtitle}</p>
    </div>

    <div className="pv05 ts2 clear">
      {props.locals.images.map((img, i) => (
        <ProjectImage key={i} image={img}/>
      ))}
    </div>
  </Main>
)
