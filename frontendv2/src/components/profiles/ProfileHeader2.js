import '../../css/profile.css'
import React from 'react'
import ProfileBanner from './ProfileBanner'
import ProfilePicture from './ProfilePicture'
import ProfileBtns from './ProfileBtns'

const ProfileHeader2 = React.memo(({user}) => {
  return (
    <div>
        <ProfileBanner src={user?.banner} alt={user?.username}/>
        <div className='header-links-wrapper2'>
            <div className='profile-picture-header-wrapper'>
                <ProfilePicture user={user}/>
            </div>
            <div className='profile-username-wrapper'>
              <p className='profile-username'>@{user?.username}</p>
            </div>
            <div>
                <ProfileBtns user={user} />
            </div>
        </div>
    </div>
  )
})

export default ProfileHeader2