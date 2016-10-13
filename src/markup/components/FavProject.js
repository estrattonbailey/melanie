import React from 'react'

export default ({ title, caption, url }) => (
  <article className="fav relative px05 mv05 ts2">
    <a href={url}><h3 className="mv0">
      <span className="cb">{title}</span>
      <i className="arrow"></i>
    </h3></a>
    <p className="cb mv0">{caption}</p>
  </article>
)
