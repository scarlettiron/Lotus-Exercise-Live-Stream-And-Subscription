import React from 'react'
import '../../css/navbars.css'

const NavBtn1 = React.memo(({action=null, text= null}) => {
  return (
    <div className='side-bar-btn-main-wrapper'>
        <button onClick={() => {action()}} className='side-bar-btn-item nav-btn-1'>
          <h3 className='side-bar-text'>{text}</h3>
        </button>
    </div>
  )
})

export default NavBtn1