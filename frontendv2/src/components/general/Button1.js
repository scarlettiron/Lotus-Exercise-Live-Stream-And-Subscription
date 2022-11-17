import React from 'react'
import '../../css/general.css'

const Button1 = ({text, action, btnClass=null, form=null}) => {
  const BtnClass = btnClass ? `${btnClass} btn-1` :'btn-1'
  return (
    <div className='display-inline'>
        <button onClick={action} className={BtnClass} form={form}>{text}</button>
    </div>
  )
}

export default Button1