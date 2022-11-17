import React, {useState, useEffect} from 'react'
import '../../css/profile.css'
import ProfileBanner from './ProfileBanner'
import ProfilePicture from './ProfilePicture'
import ProfileBtns from './ProfileBtns'


const ProfileHeader = ({user, ...rest}) => {
  let [bioDrop, setBioDrop] = useState(false)
  console.log(user)
  console.log('inside profile header')
  return (
    <div>
      {/* <ProfileBanner src={user.banner} alt={user.username}/> */}
 {/*      <div className='header-links-wrapper'>
          <div className='profile-pic-name-display-wrapper'>
              <ProfilePicture  user={user}/> 
              <div className='profile-name'>
                  <p className='title-secondary'>@{user?.username}</p>
              </div>
          </div>
          <div className='profile-btn-section'>
             <ProfileBtns />
          </div>
      </div>
      <div className='bio-wrapper'>
        {bioDrop ? <p>{user?.bio}</p> : <p>{user?.bio.substring(0, 50)}</p>}
      </div> */}
    </div>
  )
}

export default ProfileHeader