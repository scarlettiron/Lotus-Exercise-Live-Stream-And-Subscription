import React from 'react'
import '../../css/general.css'

const Error2 = ({message=null}) => {
  return (
    <div className='w-100 justify-content-center'>  
        <h4 className='text-error'>{message}</h4>
    </div>
  )
}

export default Error2