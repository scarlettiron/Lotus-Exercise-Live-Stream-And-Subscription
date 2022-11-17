import React,{useContext, useState} from 'react'
import AuthContext from '../../context/AuthContext'
import NavBtn2 from './NavBtn2'
import NavBtn1 from './NavBtn1'
import MorePopup from './MorePopup'
import DevBtn from '../Developers/DevBtn'
import {ReactComponent as HomeIcon} from '../../assets/heart-not-liked.svg'
import {ReactComponent as Bell} from '../../assets/bell-secondary.svg'
import {ReactComponent as Envelope} from '../../assets/envelope3.svg'
import {ReactComponent as Calendar} from '../../assets/calendar.svg'
import {ReactComponent as ShoppingBag} from '../../assets/shopping-bag.svg'
import '../../css/navbars.css'
import '../../css/general.css'

const SideNav = ({handleToggleNotifications}) => {
  const {User} = useContext(AuthContext)
  const [morePupop, setMorePopup] = useState(false)

  const toggleMorePopup = () => {
    setMorePopup(!morePupop)
  }

  return (
    <div>

    {User && User.username === 'developer' &&
      <div className='w-100 justify-content-center'>
        <DevBtn/>
      </div>
    }

    <NavBtn2 
    icon={<HomeIcon className='nav-svg' viewBox="0 0 297 297" />} 
    text='Feed' 
    link={'/feed'}
    />

    {!User &&
      <NavBtn2
      text='Login / Signup'
      link='/login'
      />
    }

    {User &&
    <>
      <NavBtn2 
      icon={<Envelope className='nav-svg' viewBox="0 0 60 60" />} 
      text='Inbox' 
      link={'/inbox'}
      />

      <NavBtn2 icon={<Bell className='nav-svg' viewBox="0 0 1000 1000" />} 
      text='Notifications' 
      action={handleToggleNotifications}
      />

      <NavBtn2 icon={<Calendar className='nav-svg' viewBox="0 0 351.066 351.066" />} 
      text='Calendar' 
      link='/calendar'
      />

      <NavBtn2 
      icon={<ShoppingBag className='nav-svg' viewBox="0 0 490 490" />} 
      text='Purchases' 
      link='/purchases'
      />


      {morePupop ?
        <MorePopup toggleMorePopup={toggleMorePopup}/>
        :
        <NavBtn1
        text='More'
        action={toggleMorePopup}
        />
      }
    </>
    }
</div>
  )
}

export default SideNav