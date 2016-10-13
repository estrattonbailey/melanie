import React from 'react'

export default ({ image = 'default' }) => (
  <div className="work__image">
    <img 
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      data-normal={image}/>
  </div>
)
