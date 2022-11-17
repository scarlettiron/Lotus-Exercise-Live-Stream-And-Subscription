import React from 'react'
import '../../css/loader.css'
import Button1 from '../general/Button1'

const LoadingSpinnerForm = ({btnAction=null}) => {
  return (
    <div className='form-loader-container'>
        <div className='form-loader temp'>
        {btnAction && <><div className='lds-btn-wrapper'><Button1 action={btnAction} text={'cancel'}/></div></>}
        <div className='lds-wrapper'>
        <div className="lds-roller lds-form"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        </div>
    </div>
  )
}

export default LoadingSpinnerForm