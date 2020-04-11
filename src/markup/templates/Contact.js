import React from 'react'
import Markdown from 'react-markdown'

import Main from '../components/Main.js'
import Foot from '../components/Foot.js'
import PageHeader from '../components/PageHeader.js'

export default props => {
  const { title, subtitle, description } = props.pages.contact

  return (
    <Main {...props}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        description={description}
        paddingBottomVariant/>

      <div className="outer contact">
        <div className="container--s mha">
          <div className="flex flex-items-center">
            <button id="nextSubject" className="h3 mr05">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"></path></svg>
            </button>
            <h5 className="cb mv0 mr1 strong">subject line</h5>
            <hr className="mv0"/>
          </div>
          <h2 id="subjectLine" className="cb subject-line h2">"Subject line here"</h2>
          <h6 id="prompt">(click to copy)</h6>
        </div>
      </div>

      <Foot {...props}/>
    </Main>
  )
}
