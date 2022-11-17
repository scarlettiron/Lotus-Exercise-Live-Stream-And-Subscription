import React from 'react'
import { Link } from 'react-router-dom'
import '../../css/general.css'

const LinkBtn = ({text, link, btnClass=null}) => {
  let btnStyle = btnClass ? `${btnClass} btn-1` : 'btn-1'
  
  return (
    <div className='display-inline'>
        <Link to={link}>
            <button className={btnStyle}>{text}</button>
        </Link>
    </div>
  )
}

export default LinkBtn