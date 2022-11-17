import React from 'react'
import '../../css/general.css'

const Button3 = ({action, text, wrapperClass=null}) => {
  let wrapper = wrapperClass ? `${wrapperClass} w-100` : 'w-100'
  return (
    <div className={wrapper}>
        <button className='button3' onClick={action} >{text}</button>
    </div>
  )
}

export default Button3