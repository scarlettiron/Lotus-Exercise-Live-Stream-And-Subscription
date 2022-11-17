import React from 'react'
import '../../css/chat.css'

const ThreadProfilePic = ({user}) => {
  return (
    <div className='thread-img-container'>
        <img className='thread-img' src={user.pic} alt={user.username}/>
    </div>
  )
}

export default ThreadProfilePic