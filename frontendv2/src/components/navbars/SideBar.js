import React, {useState, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import LinkBtn from '../general/LinkBtn'
import ProfilePicBtn from '../general/ProfilePicBtn'
import SideNav from './SideNav'
import NotificationsSidebar from '../notifications/NotificationsSidebar'
import {ReactComponent as Icon} from '../../assets/logo/LotusLogo.svg'
import '../../css/navbars.css'
import '../../css/general.css'

import {ReactComponent as NavGray} from '../../assets/menu-hamburger-gray.svg'


const SideBar = ({chat=false}) => {
    const {UserProfile} = useContext(AuthContext)
    const [toggleNotifications, setToggleNotifications] = useState(() => false)
    const [toggleNav, setToggleNav] = useState(() => false)
  
    const handleToggleMainNav = () => {
      setToggleNav(!toggleNav)
    }
  
    const handleToggleNotifications = () => {
      setToggleNotifications(!toggleNotifications)
    }

    const containerClass = chat ? 'sidebar-container sidebar-container-chat' : 'sidebar-container'
    const sidebarClass = chat ? 'sidebar chat' : 'sidebar'
  return (
    <div className={toggleNav ? `${containerClass} active` : containerClass}>
        <button onClick={handleToggleMainNav} className={chat ? 'mobile-btn mobile-btn-chat' : 'mobile-btn'}>
            <NavGray />
        </button>
        <div className={toggleNav ? `${sidebarClass} active` : sidebarClass}>
            {UserProfile && 
                <>
                    <div className='side-bar-profile-wrapper'>
                    <ProfilePicBtn user={UserProfile} btnClass='nav-profile-pic' link='/home'/>
                    </div>
                    
                    {UserProfile.is_instructor &&
                        <div className='side-bar-profile-wrapper'>
                          <LinkBtn text='Create Post' link={'/new-post/create'}/>
                        </div> 
                    }
                </> 
            }

            {!UserProfile &&
              <div className='side-bar-profile-wrapper'>
                  <Icon className='svg-logo' viewBox="0 0 512.003 512.003"/>
              </div>
            }
          {!toggleNotifications &&
            <SideNav
            handleToggleNotifications={handleToggleNotifications}
            />
          }
        
          {toggleNotifications &&
          <NotificationsSidebar
          handleToggleNotifications={handleToggleNotifications}
          />
          }
        </div>

    </div>
  )
}

export default SideBar