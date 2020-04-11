import React from "react";

import Main from "../components/Main.js";
import Foot from "../components/Foot.js";

export default props => {
  const { title, works } = props.pages.misc;

  return (
    <Main {...props}>
      <div className="outer">
        <div className='container--m mha ts1 pt1 pb1'>
          <h3 className="cb mv0">{title}</h3>
        </div>
      </div>

      <div className="outer">
        <div className="container--m mha">
          <div className="misc pv05">
            <div className="misc__inner flex flex-wrap">
              {works.map((work, i) => (
                <figure
                  className="misc__item block relative"
                  key={i}
                  style={{ width: (work.width || 1 / 2) * 100 + "%" }}
                >
                  <img src={`/images/${work.image}`} />

                  {work.caption && (
                    <figcaption className="pt1">
                      <p className="mt0 mb0">{work.caption}</p>
                      <h6 className="mv0">
                        <strong>
                          <small>{work.date}</small>
                        </strong>
                      </h6>
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Foot {...props} />
    </Main>
  );
};
