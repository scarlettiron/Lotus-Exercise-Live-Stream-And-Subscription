import React from 'react'
import { Link } from 'react-router-dom'
import Button4 from './Button4'

const DropDownItem = ({link, text, svg, action}) => {
  return (
    <div className='drop-item'>
      {link && <>
          <Link className='drop-link' to={link}>
            {svg && {svg}}
            <p>{text}</p>
          </Link>
         </>
      }

      {action && <Button4 text={text} action={action} />}
    </div>
  )
}

export default DropDownItem
