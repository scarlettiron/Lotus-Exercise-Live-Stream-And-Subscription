import React from 'react'

const InputBox = ({id='', placeholder='', onChange=null, ...props}) => {
  return (
    <div className='input-box-wrapper'>
        <input id={id} placeholder={placeholder} onChange={onChange} props />
    </div>
  )
}

export default InputBox