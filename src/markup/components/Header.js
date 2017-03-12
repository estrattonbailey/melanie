import React from 'react'

export default props => (
  <header className="nav fixed fit-l fit-t fit-r block">
    <div className="outer flex flex-wrap w1">
      <a className="nav__logo" href="/">melanie slattery</a>
      <nav className="nav__inner inline-block flex-auto">
        <a href="/about">/about</a>
        <a href="/work">/work</a>
        <a href="/contact">/contact</a>
      </nav>
    </div>
    <hr className="ci bg-cc"/>
  </header>
)
