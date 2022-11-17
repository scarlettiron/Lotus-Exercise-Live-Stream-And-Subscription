import React from 'react'
import '../../css/loader.css'

const LoadingSpinner1 = () => {
  return (
    <div className='form-loader-container'>
        <div className='form-loader temp'>
       <div className='lds-btn-wrapper'></div>
        <div className='lds-wrapper'>
        <div className="lds-roller lds-form"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        </div>
    </div>
  )
}

export default LoadingSpinner1