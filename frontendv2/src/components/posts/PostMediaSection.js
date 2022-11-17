import React, {useState} from 'react'
import {ReactComponent as ArrowLeft} from '../../assets/chevron-left-circle.svg'
import {ReactComponent as ArrowRight} from '../../assets/chevron-right-circle.svg'
import Button2 from '../general/Button2'

const PostMediaSection = ({album}) => {
    const postMedia = album.album_media.length ? album.album_media : [album.album_media]
    
    const [currentIndex, setCurrentIndex] = useState(0)
    const numberofMedia = album.album_media.length

    const showNextSlide = () => {
      currentIndex === numberofMedia - 1 ? setCurrentIndex(0) 
      : setCurrentIndex( prevIndex => prevIndex + 1)
    }

    let showPrevSlide = () => {
      currentIndex === 0 ? setCurrentIndex(numberofMedia - 1)
      : setCurrentIndex(prevIndex => prevIndex - 1)
    }
    

  return (
    <div className='post-media-wrapper'>
        {postMedia.map((Media, index) => {
          if(Media.type.includes('video')){
              return <React.Fragment key={index}>
                  <video controls className={index === currentIndex ?
                        'post-media slide active' : 'post-media slide'}>
                    <source autoPlay src={Media.media} type={Media.type}></source>
                  </video>
                </React.Fragment>
          }
          return (
            <img key={index} src={Media.media} alt={postMedia.user} className={index === currentIndex ?
              'post-media slide active' : 'post-media slide'} />
          )
        })}
        {postMedia.length > 1 && 
          <div className='media-buttons-wrapper'>
            <div className='btn-bg'>
              <Button2 action={showPrevSlide} text={<ArrowLeft/>} />
            </div>
            <div className='btn-bg'>
              <Button2 action={showNextSlide} text={<ArrowRight />} />
            </div>
          </div>
        }
    </div>
  )
}

export default PostMediaSection