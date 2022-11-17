import React from 'react'
import '../../css/profile.css'
import '../../css/chat.css'

const ProfilePicture = ({user, wrapperClass=null}) => {
  const wrapper = wrapperClass ? wrapperClass : 'profile-picture-wrapper'

  return (
    <div className={wrapper}>
        <img className='profile-picture' src={user.pic} alt={user.username}/>
    </div>
  )
}

export default ProfilePicture