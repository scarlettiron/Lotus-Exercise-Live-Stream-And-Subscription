import React from 'react'
import {Link} from 'react-router-dom'
import '../../css/posts.css'
import '../../css/general.css'
import '../../css/search.css'

const ProfilePicUsernameBtn = ({user, wrapperClass=null, btnClass=null, link=null}) => {
    let btnStyleClass = btnClass ? `${btnClass} profile-pic-btn`: 'profile-pic-btn'
    link = link ? link : `/user/${user.username}`
    
    
        return (
        <div className='margin-10'>
            <Link to={link} className='drop-link profile-link-btn-wrapper'>
                <div className='display-inline margin-right-5'>
                    <button className={btnStyleClass}>
                        <img className='profile-pic-btn-img' src={user?.pic} alt={user?.username}/>
                    </button>
                </div>
                <div className='display-inline'>
                    <p className='profile-username'>{user.username}</p>
                </div>
            </Link>
        </div>
    )

}

export default ProfilePicUsernameBtn