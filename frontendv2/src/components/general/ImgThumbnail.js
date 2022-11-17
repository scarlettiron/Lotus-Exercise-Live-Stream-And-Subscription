import React from 'react'
import '../../css/general.css'
const ImgThumbnail = ({image, className=null, name=''}) => {
  let imgClass = className ? `${className} img-thumbnail` : 'img-thumbnail'
  return (
    <div className={imgClass} key={`${name}-wrapper`}>
        <img  key={`${name}-input`} className='img-thumbnail-img' src={image} alt='thumbnail' />
    </div>
  )
}

export default ImgThumbnail