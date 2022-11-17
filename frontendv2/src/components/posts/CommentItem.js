import React from 'react'
import ProfilePicBtn from '../general/ProfilePicBtn'
import '../../css/posts.css'
import '../../css/comments.css'
import { useHistory } from 'react-router-dom'
import {convertToFormattedSiteDate} from '../../utils/DateFunctions'

const CommentItem = ({comment}) => {
    const history = useHistory()

    const redirectToUserProfile = () => {
        let redirectUrl = `user/${comment.user.username}`
        history.push(redirectUrl)
    }

  return (

    <div className='w-100 padding-5 flex-nowrap'>
        <div className='padding-5 display-inline'>
            <div className='flex-nowrap'>
                <ProfilePicBtn 
                action={redirectToUserProfile}
                user={comment?.user} 
                btnClass={'comment-profile-pic'}
                />  
                <p className='comment-username'>@{comment.user.username}</p>
            </div>
        </div>
        <div className='display-inline  margin-0 padding-5 w-70'>
            <div className='comment-text-wrapper'>
                <p className='word-break comment-text'>{comment.body}</p>
            </div>
            <p className='comment-date'>{convertToFormattedSiteDate(comment.date)}</p>
        </div>
    </div>
  )
}

export default CommentItem