import React from 'react'
import {ReactComponent as Dots} from '../../assets/dropdown-dots.svg'
import '../../css/general.css'
const DropDownDotsBtn = ({action, svgClass}) => {
  return (
    <div>
        <button onClick={action} className='button2'><Dots className ={svgClass} /></button>
    </div>
  )
}

export default DropDownDotsBtn