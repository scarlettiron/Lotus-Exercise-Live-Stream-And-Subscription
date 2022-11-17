import React, {useState, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import { useHistory } from 'react-router-dom'
import {createListLikeUrl, deleteLikeUrl} from '../../utils/BaseInfo'
import {ReactComponent as CommentRound } from '../../assets/comment-round.svg'
import {ReactComponent as HeartLiked} from '../../assets/heart-liked.svg'
import {ReactComponent as HeartNotLiked} from '../../assets/heart-not-liked-placeholder.svg'

import Button2 from '../general/Button2'
import '../../css/posts.css'
import '../../css/general.css'

const PostBtns = ({post}) => {

    const {User} = useContext(AuthContext)

    const [hasLiked, setLiked] = useState(()=> post.liked >= 1 ? true : false)
    const history = useHistory()

    const handleLikePost = async () => {
        let fetchConfig = {method:'POST', body:JSON.stringify({post:post.id, user:User.user_id})}
        let {response, data} = await CustomFetch(`${createListLikeUrl}${User.username}`, fetchConfig)
        if(response.status === 201){
            setLiked(true)
        }
    }

    const handleUnlikePost = async () => {
        let fetchConfig = {method:'DELETE'}
        let {response, data} = await CustomFetch(`${deleteLikeUrl}${post.id}/${User.user_id}`, fetchConfig)
        if(response.status === 204){
            setLiked(false)
        }
    }

    const commentRedirect = () => {
        history.push(`/post/${post.id}`)
    }

  return (
    <div className='post-action-btns-wrapper'>
        <div className='post-action-btn'>
            {hasLiked ? <> <Button2 action={handleUnlikePost} text={<HeartLiked className="post-heart-svg" viewBox="0 0 45.743 45.743"/>}/> </>
            : <><Button2 action={handleLikePost} text={<HeartNotLiked className="post-heart-svg" viewBox="0 0 45.743 45.743"/>} /> </>}
        </div>
        <div className='post-action-btn'>
            <Button2 action={commentRedirect} text={<CommentRound className="post-comment-svg" viewBox="0 0 512 512"/>}/>
        </div>
        <div className='post-like-comment-count-wrapper'>
            <div className='display-inline'>
                {post.like_count > 0 && <p className='text-muted'>{post.like_count}  Likes</p>}
            </div>
            <div className='display-inline'>
                {post.comment_count > 0 && <p className='text-muted'>{post.comment_count}  Comments</p>}
            </div>
        </div>

    </div>
  )
}

export default PostBtns