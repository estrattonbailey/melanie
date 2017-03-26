import React from 'react'

export default props => (
  <header className="nav fixed fit-l fit-t fit-r block">
    <div className="outer flex flex-items-center w1">
      <a className="nav__logo relative z1" href="/">melanie slattery</a>
      <nav id="menu" className="nav__inner inline-block flex-auto fixed fit-x px1 z0">
        <a className="block pv1" href="/about"><span>/about</span></a>
        <a className="block pv1" href="/work"><span>/work</span></a>
       <a className="block pv1" href="/contact"><span>/contact</span></a>
      </nav>
      <button id="toggle" className="hamburger block z10 relative">
        <span className="hamburger__bar absolute fit-x mxa"/>
        <span className="hamburger__bar absolute fit-x mxa"/>
        <span className="hamburger__bar absolute fit-x mxa"/>
      </button>
    </div>
    <hr className="ci bg-cc"/>
  </header>
)
