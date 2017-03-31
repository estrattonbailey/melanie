import React from 'react'

import Main from '../components/Main.js'
import Foot from '../components/Foot.js'
import ProjectImage from '../components/ProjectImage.js'
import PageHeader from '../components/PageHeader.js'
import FavProject from '../components/FavProject.js'

export default props => (
  <Main {...props}>
    <PageHeader
      title={props.locals.title}
      subtitle={props.locals.content.subtitle}
      description={props.locals.content.subsubtitle}
      projectFor={props.locals.content.projectFor}
      paddingBottomVariant/>

    {props.locals.externalLinks && (
      <div className="clear">
        <div className="outer">
          <div className="container--s mha">
            {props.locals.externalLinks.map(f => (
              <FavProject
                key={f.title}
                title={f.title}
                caption={f.caption}
                url={f.url}/>
            ))}
          </div>
        </div>
      </div>
    )}

    {props.locals.showImages === undefined && (
      <div className="pv05 ts2 clear">
        {props.locals.images.map((img, i) => (
          <ProjectImage key={i} image={img}/>
        ))}
      </div>
    )}

    <Foot {...props}/>
  </Main>
)
