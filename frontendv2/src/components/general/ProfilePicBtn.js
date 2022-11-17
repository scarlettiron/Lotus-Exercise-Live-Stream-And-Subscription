import React from 'react'
import { Link } from 'react-router-dom'
import '../../css/posts.css'
import '../../css/general.css'
import '../../css/search.css'

const ProfilePicBtn = ({action={}, user, btnClass, link = null}) => {
  const btnStyleClass = btnClass ? `${btnClass} profile-pic-btn`: 'profile-pic-btn'
  const btnLink = link ? link : `/user/${user.username}`
  return (
    <div>
        <button className={btnStyleClass}>
          <Link to={btnLink} className='drop-link'>
            <img className='profile-pic-btn-img' src={user?.pic} alt={user?.username}/>
          </Link>
          </button>
    </div>
  )
}

export default ProfilePicBtn