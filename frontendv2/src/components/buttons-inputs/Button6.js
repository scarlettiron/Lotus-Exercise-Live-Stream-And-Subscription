import React from 'react'
import '../../css/general.css'
import '../../css/buttons-inputs.css'

const Button6 = ({text=null, action=null, background=null, color=null, form=null}) => {
  return (
    <div>
        <button form={form} onClick={action} className={background ? `${background} btn-6 ${color}` : `btn-6 ${color}`}>
            {text}
        </button>
    </div>
  )
}

export default Button6