import React from 'react'
import { Link } from 'react-router-dom'
import '../../css/navbars.css'
import '../../css/general.css'

const NavBtn2 = React.memo(({action=null, text='', link=null, icon=''}) => {
  return (
    <div>
        {link && 
          <Link to={link}>
          <div className='side-bar-btn-main-wrapper'>
                  {icon &&
                    <div className='side-bar-btn-item display-inline'>
                      <span className='side-bar-text'>{icon}</span>
                  </div>
                  }
                  <div className='side-bar-btn-item display-inline'>
                      <p className='side-bar-text'>{text}</p>
                  </div>
          </div>
          </Link>
        }
        {action && 
          <div onClick={action} className='side-bar-btn-main-wrapper' role='button'>
            <div className='side-bar-btn-item display-inline'>
                <span className='side-bar-text'>{icon}</span>
            </div>
            <div className='side-bar-btn-item display-inline'>
                <p className='side-bar-text'>{text}</p>
            </div>
          </div>
        }
    </div>
  )
})

export default NavBtn2