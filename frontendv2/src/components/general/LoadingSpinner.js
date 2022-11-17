import React from 'react'
import '../../css/loader.css'
import Button1 from './Button1'

const LoadingSpinner = ({btnAction=null}) => {
  return (
    <div className='lds-container'>
      {btnAction && <><div className='lds-btn-wrapper'><Button1 action={btnAction} text={'cancel'}/></div></>}
      <div className='lds-wrapper'>
      <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  )
}

export default LoadingSpinner