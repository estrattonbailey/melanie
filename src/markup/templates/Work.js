import React from 'react'

// components
import Main from '../components/Main.js'
import Foot from '../components/Foot.js'
import WorkItem from '../components/WorkItem.js'
import FavProject from '../components/FavProject.js'

// elements
import PageTitle from '../elements/PageTitle.js'
import SectionDivider from '../elements/SectionDivider.js'

export default props => (
  <Main {...props}>
    <div className="outer">
      <div className="container--s mha pv1 ts1">

        <PageTitle>{props.pages.work.title}</PageTitle>

        <SectionDivider>experimental</SectionDivider>

        <div className="pv05 ts2">

          {props.projects.map(p => (
            <WorkItem
              key={p.title}
              title={p.title}
              caption={p.caption}
              url={p.url}
              image={p.images[0]}/>
          ))}

        </div>

        <SectionDivider>selected clients</SectionDivider>

        <div className="pv1 ts2">
          <div className="flex flex-wrap flex-justify-between flex-items-center">
            <div className="client-logo ph05">
            </div>
          </div>
        </div>

        <SectionDivider>personal favs</SectionDivider>

        <div className="pv05 ts2">
          {props.favs.map(f => (
            <FavProject
              key={f.title}
              title={f.title}
              caption={f.caption}
              url={f.url}/>
          ))}
        </div>

      </div>

      <Foot {...props}/>
    </div>
  </Main>
)
