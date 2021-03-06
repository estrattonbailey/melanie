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

        <SectionDivider>experiential</SectionDivider>

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

        {/* <SectionDivider>brands</SectionDivider>

        <div className="pv1 ts2">
          <img className="block w1" src="/images/clients.jpg"/>
        </div> */}

        <SectionDivider>personal favorites</SectionDivider>

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
