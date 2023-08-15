import '../../css/profile.css'
import React from 'react'
import ProfileBtns from './ProfileBtns'
import ProfileBanner2 from './ProfileBanner2'

const ProfileHeader2 = React.memo(({user}) => {
  return (
    <div>
        <ProfileBanner2 user={user}/>
        <div className='header-links-wrapper2'>
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