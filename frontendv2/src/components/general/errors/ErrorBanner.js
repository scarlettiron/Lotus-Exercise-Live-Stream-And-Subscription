import React from 'react'
import '../../../css/general.css'

const ErrorBanner = React.memo(({error, errorMessage}) => {
  return (
    <div className='margin-auto w-90 justify-content-center padding-5 bg-error'>
        <p className='text-error'>{errorMessage ? errorMessage : `Please provide a ${error}`}</p>
    </div>
  )
})

export default ErrorBanner