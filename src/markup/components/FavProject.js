import React from 'react'

export default ({ title, caption, url, external }) => (
  <article className="fav relative px05 mv05 ts2">
    <a href={url} target={external ? '_blank' : null}><h3 className="mv0">
      <span className="cb mr05">{title}</span>
      <i className="arrow"></i>
    </h3></a>
    <p className="cb mv0">{caption}</p>
  </article>
)
