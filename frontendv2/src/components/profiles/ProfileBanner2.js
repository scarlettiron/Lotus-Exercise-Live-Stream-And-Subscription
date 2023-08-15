import React from 'react'
import '../../css/profile.css'
import '../../css/general.css'

const ProfileBanner2 = ({user}) => {
  return (
    <div className='w-100 justify-content-center'>
        <div className='profile-pic-overlap-wrapper'>
            <div className='profile-picture-wrapper'>
                <img className='profile-picture' src={user.pic} alt={user.username}/>
            </div>
        </div>
        <div className='banner-wrapper'>
            <img className='banner-img' src={user.banner} alt={user.username}/>
        </div>
    </div>
   
  )
}

export default ProfileBanner2