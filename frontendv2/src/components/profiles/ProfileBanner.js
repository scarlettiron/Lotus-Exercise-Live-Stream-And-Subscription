import React from 'react'

const ProfileBanner = ({src, alt}) => {
  return (
    <div className='banner-wrapper'>
      <img className='banner-img' src={src} alt={alt}/>
    </div>
  )
}

export default ProfileBanner