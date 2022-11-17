import React from 'react'
import {Link } from 'react-router-dom'
import {ReactComponent as Bell} from '../../assets/bell.svg'
import '../../css/chat.css'

const ThreadItem = ({thread, User}) => {
    const otherUser = thread.user1.pk === User.id ? thread.user2 : thread.user1 
  return (
    <div className='thread-item-container' >
        <Link to={`/chat/${thread.pk}`}>
        <div className='thread-img-container'>
            <div className='thread-dividers'>
            <div className='thread-img-wrapper margin-right-5 display-inline'>
                <img className='thread-img' src={otherUser.pic} alt={otherUser.username}/>
            </div>
            <div className='display-inline'>
                <p className='thread-username'>{otherUser.username}</p>
            </div>
            </div>
            {thread.has_unread &&
                <div className='thread-dividers'>
                    <Bell viewBox="0 0 489.8 489.8" className='notification-svg'/>
                </div>
            }
        </div>
        </Link>
    </div>
  )
}

export default ThreadItem