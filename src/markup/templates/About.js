import React from 'react'
import Markdown from 'react-markdown'

import Main from '../components/Main.js'
import Foot from '../components/Foot.js'
import PageHeader from '../components/PageHeader.js'

const Image = ({ image }) => {
  const img = Array.isArray(image) ? image[0] : false
  const caption = img ? image[1] : false

  image = img || image

  return (
    <figure className="about__image">
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

export default props => {
  const { title, subtitle, description, images } = props.pages.about

  return (
    <Main {...props}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        description={description}/>

      <div className="container--m mha">
        <div className="flex flex-wrap pv05 ts2">
          {images.map((img, i) => (
            <Image key={i} image={img}/>
          ))}
        </div>
      </div>
      <Foot {...props}/>
    </Main>
  )
}
