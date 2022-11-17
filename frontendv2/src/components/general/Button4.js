import React from 'react'

const Button4 = ({action, text}) => {
  return (
    <div>
        <button className='button4' onClick={action}>{text}</button>
    </div>
  )
}

export default Button4