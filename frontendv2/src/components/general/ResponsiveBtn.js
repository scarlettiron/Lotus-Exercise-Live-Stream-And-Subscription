import React from 'react'
import '../../css/general.css'

const ResponsiveBtn = ({btnWrapper=null, btnClass=null, type=null, form=null,
   text, action=null, key}) => {
    let btnStyle = btnClass ? `${btnClass} responsive-btn` : 'responsive-btn'
  
  return (
    <div className={btnWrapper} key={key}>
        <button className={btnStyle} onClick={action} type={type} form={form}>
            {text}
        </button>
    </div>
  )
}

export default ResponsiveBtn