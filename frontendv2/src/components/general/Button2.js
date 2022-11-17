import React from 'react'
import '../../css/general.css'

const Button2 = ({text, action=null, form=null}) => {
  return (
        <button form={form} className='button2' onClick={action}>{text}</button>
  )
}

export default Button2