import React from 'react'

const Error3 = React.memo(({errorMessage=null, error=null}) => {
  return (
    <div className='margin-auto w-90 justify-content-center padding-5 bg-error'>
        <p className='text-error'>{errorMessage ? errorMessage : `Please provide a ${error}`}</p>
    </div>
  )
})

export default Error3