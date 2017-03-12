import React from 'react'
import Markdown from 'react-markdown'

export default ({ title, subtitle, description }) => (
  <div className="outer">
    <div className="container--s mha pv1 ts1">
      <h1 className="cb mv0">{title}</h1>
      <div className="page__subtitle h3 mv05 cb light">
        <Markdown source={subtitle}/>
      </div>
      {description &&  (
        <div className="page__description cb p">
          <Markdown source={description}/>
        </div>
      )}
    </div>
  </div>
)
