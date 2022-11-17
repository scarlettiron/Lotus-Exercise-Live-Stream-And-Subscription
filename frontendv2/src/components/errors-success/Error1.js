import React from 'react'
import '../../css/general.css'

const Error1 = ({message = null}) => {
  return (
    <div className='w-100 justify-content-center'>
        <h4 className='text-primary'>
            {message}
        </h4>
    </div>
  )
}

export default Error1