import React, {useState} from 'react'
import '../../css/profile.css'
import Divider2 from '../general/Divider2'
import Button3 from '../general/Button3'


const About = ({user}) => {
    const [bioDrop, setBioDrop] = useState(false)

    const dropBio = ()=>{setBioDrop(!bioDrop)}
    const truncate = () => {
      let truncated = user?.bio.substring(0, 300)
      let truncatedString = `${truncated}...`
      return truncatedString
    }


  return (
    <div className='sub-container sub-cont-border-resp padding-30'>
      <div className='wrapper-justify-between'>
        <p className='title-secondary-text'>About</p>
        <p className='title-secondary-text'>{user?.is_verified && user?.is_instructor ? 'Verified Instructor' : 'NonVerified Instructor'}</p>
      </div>
        <Divider2 />
          <div className='margin-20'>
          {bioDrop ? <p className='text-paragraph text-indent'>{user?.bio}</p> : 
          <p className='text-paragraph text-indent'>{user?.bio.length > 300 ? truncate() : user?.bio}</p>}
          </div>
          {user?.bio.length >= 300 &&
            <div className='about-show-btn-wrapper'>
              {bioDrop ? <Button3 text='Less' action={dropBio}/> : <Button3 text='More' action={dropBio}/>}
            </div>
          }
    </div>
  )
}

export default About