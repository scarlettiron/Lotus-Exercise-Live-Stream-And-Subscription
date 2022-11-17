import React from 'react'
import '../../css/general.css'

const Button5 = ({wrapperClass=null, btnClass=null, action, text}) => {
  const btnStyle = btnClass ? `${btnClass} button5` : 'button5'

  return (
    <div className={wrapperClass}>
        <button className={btnStyle} onClick={action}>{text}</button>
    </div>
  )
}

export default Button5