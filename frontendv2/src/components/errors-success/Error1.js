import React from 'react'
import '../../css/general.css'
import '../../css/errors-success.css'

const Error1 = React.memo(({errorMessage=null, error=null}) => {
  return (
    <div className='margin-auto w-90 justify-content-center padding-5 bg-error'>
        <p className='text-error'>{errorMessage ? errorMessage : `Please provide a ${error}`}</p>
    </div>
  )
})


export default Error1