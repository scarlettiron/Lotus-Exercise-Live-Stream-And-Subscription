import React, {useState} from 'react'
import DropDownItemBtn from './DropDownItemBtn'
import '../../../css/general.css'
import '../../../css/posts.css'
import '../../../css/dropdowns.css'

import { CountRenders } from '../../../utils/CountRenders'

const DropdownBtnMenu = React.memo(({items, menuIcon, menuBtnStyle}) => {
    const [dropDown, setDropDown] = useState(() => false)
    const toggle = () => {setDropDown(!dropDown)}

    const btnStyle = menuBtnStyle ? `${menuBtnStyle} drop-menu-btn` : 'drop-menu-btn'

    CountRenders('dropdown menu')

  return (
        <div className='dot-wrapper'>
          <button className={btnStyle} onClick={toggle}>{menuIcon}</button>
          {dropDown && <>
            <div className='drop-wrapper post-dropdown-width temp'>
               {items.map((item, index) => {
                return <DropDownItemBtn 
                        key={index} 
                        text={item.text} 
                        onclick={item.onClick} 
                        />
              })}
            </div>
          </> }
        </div>
  )
})

export default DropdownBtnMenu