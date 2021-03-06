import React from 'react'

export default ({ title, caption, url, image }) => (
  <article className="item relative flex flex-wrap mv05 ts2">
    <div className="item__image relative mb1 tsx">
      <a href={url}>
        <img className="w1 absolute fit-x"
          src={/images/.test(image) ? image : `/images/${image}`}/>
      </a>
    </div>
    <div className="item__info mb1 tsx">
      <a href={url}>
        <h3 className="mt0 cb">{title}</h3>
      </a>
      <p className="mt0 mb05 cb">{caption}</p>
      <a href={url} className="item__view h5">
        <span className="mr05">view</span>
        <i className="arrow ci"></i>
      </a>
    </div>
  </article>
)
