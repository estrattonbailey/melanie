import React from 'react'

export default ({ image = 'default' }) => (
  <div className="work__image">
    <img src={/images/.test(image) ? image : `/images/${image}`}/>
  </div>
)
