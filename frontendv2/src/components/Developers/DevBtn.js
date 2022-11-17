import React from 'react'
import './Developers.css'

const DevBtn = ({action=null}) => {
    const text = '<Dev/>'
  return (
    <div>
        <button type='button' className='devBtn' onClick={action}>
            {text}
        </button>
    </div>
  )
}

export default DevBtn