import React from 'react'
import Markdown from 'react-markdown'

const def = 'container--s mha ts1'

export default ({ title, subtitle, description, projectFor, callouts = [], paddingBottomVariant }) => (
  <div className="outer">
    <div className={def + (paddingBottomVariant ? ' pt1 pb05' : ' pt1 pb05')}>
      <h1 className="cb mv0">{title}</h1>
      <div className="page__subtitle h3 mv05 cb light">
        <Markdown source={subtitle}/>
      </div>
      {description &&  (
        <div className="page__description wysiwyg cb p theme">
          <Markdown source={description}/>
        </div>
      )}
      <div className="block relative mt1 ts5">
        {Boolean(callouts.length) &&  (
          callouts.map(callout => (
            <p className="block cb ts5 mt0 mb0">
              <small>
                <strong>{callout.label}:</strong> <em>{callout.value}</em>
              </small>
            </p>
          ))
        )}
      </div>
    </div>
  </div>
)
