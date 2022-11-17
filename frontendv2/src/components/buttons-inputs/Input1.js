import React from 'react'
import '../../css/buttons-inputs.css'

const Input1 = ({type, placeholder, name, error, wrapperClass=null}) => {
  return (
    <div className={wrapperClass ? wrapperClass : 'w-100'}>
        <input className={error === name ? 'input-1 error' : 'input-1'} 
        name={name} id={name} 
        placeholder={placeholder} type={type}/>
    </div>
  )
}

export default Input1