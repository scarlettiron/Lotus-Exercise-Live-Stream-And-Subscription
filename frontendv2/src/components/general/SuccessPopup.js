import React from 'react'
import {ReactComponent as SuccessCircle} from '../../assets/success-circle.svg'
import '../../css/success.css'

const SuccessPopup = () => {
  return (
    <div className='success-container'>
        <div className='success-wrapper'>
            <SuccessCircle viewBox="0 0 50 50"  className='success-icon'/>
        </div>
    </div>
  )
}

export default SuccessPopup