import React from 'react'
import '../../../css/dropdowns.css'
import '../../../css/general.css'

import { CountRenders } from '../../../utils/CountRenders'

const DropDownItemBtn = ({text, onClick}) => {
    CountRenders('drop item')
  return (
    <div className='drop-item'>
        <button className='drop-item-btn' onClick={onClick}>{text}</button>
    </div>
  )
}

export default DropDownItemBtn