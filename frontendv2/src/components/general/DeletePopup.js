import React from 'react'
import Button1 from './Button1'

const DeletePopup = ({cancel, action}) => {
  return (
    <div className='delete-popup-container temp'>
        <div className='delete-popup-text-wrapper'>
            <p>Are You Sure?!</p>
        </div>
        <div className='delete-popup-btn-wrapper'>
            <Button1 text={'Cancel'} action={cancel}/>
            <Button1 text={'Delete'} action={action} />
        </div>
    </div>
  )
}

export default DeletePopup