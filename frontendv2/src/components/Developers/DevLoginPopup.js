import React from 'react'
import { ReactComponent as Exit } from './cross.svg'
import './Developers.css'


const DevLoginPopup = ({closePopup = null}) => {
  return (
    <div className='devContainer'>
        <div className='w-100 justify-content-end'>
            <button className='devCloseBtn' onClick={closePopup} type='button' >{<Exit viewBox='0 0 32 32' className='x-svg'/>}</button>
        </div>
        <div className='justify-content-center flex-wrap'>
            <div className='w-100'>
                <h3 className='padding-5 margin-0'>Demo Account Login</h3>
                <div className='devDivider1'></div>
            </div>
            <div className='w-100'>
                <h4 className='padding-0 margin-5'>Username: developer</h4>
                <h4 className='padding-0 margin-5'>PAssword: developer</h4>
            </div>
        </div>
    </div>
  )
}

export default DevLoginPopup