import React from 'react'
import {ReactComponent as LockSquare} from '../../assets/heart-liked.svg'
import { useHistory } from 'react-router-dom'

const PostSubscribe = ({post}) => {
  const history = useHistory()
  return (
    <div className='pay-sub-container'>
            <div class='pay-sub-wrapper'>
                <div className='pay-sub-btn-wrapper'>
                    <LockSquare/>
                </div>
                <div className='pay-sub-btn-wrapper'>
                    <h2>Subscribe to unlock</h2>
                </div>
                <div className='pay-sub-btn-wrapper padding-30'>
                    <button className='width-150 btn-1' onClick={() => history.push(`/user/${post.user.username}`)}>Subscribe</button>
                </div>
            </div>
    </div>
  )
}

export default PostSubscribe