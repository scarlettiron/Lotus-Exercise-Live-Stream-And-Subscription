import React,{useState} from 'react'
import PostTextBody from './PostTextBody'
import PostMediaSection from './PostMediaSection'
import PostPay from './PostPay'

const PostBody = ({post}) => {
  const [purchased, setPurchased] = useState(() => post.purchased > 0 ? true : false)
  const handleSetHasPurchased = () => {
    setPurchased(true)
  }
  return (
    <div>
        {post.body && <PostTextBody post={post}/>} 

        {post.album && 
        (post.price_units > 0 && !post.is_owner && !purchased ? 
        <PostPay post={post} handleSetHasPurchased={handleSetHasPurchased}/>
        : <PostMediaSection album={post.album}/>)
        }
    </div>
  )
}

export default PostBody