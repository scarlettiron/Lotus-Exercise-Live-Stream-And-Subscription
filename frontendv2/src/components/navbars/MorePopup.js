import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import {ReactComponent as ArrowDown} from '../../assets/chevron-down-circle.svg'
import Button2 from '../general/Button2'
import '../../css/navbars.css'
import '../../css/general.css'


const MorePopup = ({toggleMorePopup}) => {
    const {logoutUser} = useContext(AuthContext)

  return (
    <div className='more-popup-container'>
        <div className='w-100 justify-content-end padding-0 margin-0'>
            <Button2 text={<ArrowDown/>} action={toggleMorePopup}/>
        </div>
        <Link to='/transactions'>
            <div className='more-popup-item'>
                <p className='padding-0 margin-0'>Transactions</p>
            </div>
        </Link>
        <Link to='/profile/edit'>
            <div className='more-popup-item'>
                <p className='padding-0 margin-0'>Edit Profile</p>
            </div>
        </Link>
        <Link to='/help'>
            <div className='more-popup-item'>
                <p className='padding-0 margin-0'>Help</p>
            </div>
        </Link>
        
        <div className='more-popup-item' onClick={() => {logoutUser()}}>
            <p className='padding-0 margin-0'>Logout</p>
        </div>
    </div>
  )
}

export default MorePopup