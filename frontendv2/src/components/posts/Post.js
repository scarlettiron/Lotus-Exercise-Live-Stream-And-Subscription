import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import CustomFetch from '../../utils/CustomFetch'
import { postDetailUpdateDelete } from '../../utils/BaseInfo'
import PostHeader from './PostHeader'
import PostBtns from './PostBtns'
import PostSubscribe from './PostSubscribe'
import PostBody from './PostBody'
import DeletePopup from '../general/DeletePopup'
import '../../css/general.css'
import '../../css/profile.css'

const Post = React.memo(({post, handleSethasPurchased = null, user = null}) => {
  post.user = user ? user : post.user

  const history = useHistory()
  const [deletePopup, setDeletePopup] = useState(false)

  const toggleDeletePopup = () => {setDeletePopup(!deletePopup)}

  const handleDelete = async () => {
    const fetchConfig = {method:'DELETE'}
    const {response, data} = await CustomFetch(`${postDetailUpdateDelete}${post.id}`, fetchConfig)
    if(response.status === 204){
      history.push(`/user/${post.user.username}`)
    }
  }

  return (
    <div className='post-container' onClick={window.location.path === `post/${post.id}` ? null : () => {history.push(`/post/${post.id}`)}}>
        <PostHeader  post={post} toggleDeletePopup={toggleDeletePopup}/>
        {deletePopup &&  <>
        <div className='post-container'>
            <DeletePopup cancel={toggleDeletePopup} action={handleDelete} />
        </div>
        </>}
        
        {post.subscription && !post.user.subscribed ? 
          <PostSubscribe 
          post={post} 
          handleSethasPurchased={handleSethasPurchased}
          /> 
        : 
          <PostBody 
          post={post}  
          handleSethasPurchased={handleSethasPurchased}
          />
        }

        <PostBtns post={post}/>
    </div>
  )
})

export default Post