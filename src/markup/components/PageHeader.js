import React from 'react'
import Markdown from 'react-markdown'

const def = 'container--s mha ts1'

export default ({ title, subtitle, description, projectFor, paddingBottomVariant }) => (
  <div className="outer">
    <div className={def + (paddingBottomVariant ? ' pt1 pb05' : ' pv1')}>
      <h1 className="cb mv0">{title}</h1>
      <div className="page__subtitle h3 mv05 cb light">
        <Markdown source={subtitle}/>
      </div>
      {description &&  (
        <div className="page__description cb p theme">
          <Markdown source={description}/>
        </div>
      )}
      {projectFor &&  (
        <div className="pt05 cb">
          <p className="ts5"><strong>For:</strong> <em>{projectFor}</em></p>
        </div>
      )}
    </div>
  </div>
)
