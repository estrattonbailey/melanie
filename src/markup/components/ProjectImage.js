import React from 'react'
import Markdown from 'react-markdown'

export default ({ image }) => {
  const img = Array.isArray(image) ? image[0] : false
  const caption = img ? image[1] : false

  image = img || image

  return (
    <figure className="work__image">
      <img className="block" src={/images/.test(image) ? image : `/images/${image}`}/>
      {caption && (
        <div className="flex flex-wrap">
          <figcaption className="work__image__caption pv025 ph05">
            <div className="cb">
              <Markdown source={caption}/>
            </div>
          </figcaption>
        </div>
      )}
    </figure>
  )
}
