import React from 'react'
import '../../../css/general.css'

const GeneralHeader = ({text}) => {
  return (
    <div className='justify-content-center bg-secondary'>
        <h2 className='text-white'>{text}</h2>
    </div>
  )
}

export default GeneralHeader