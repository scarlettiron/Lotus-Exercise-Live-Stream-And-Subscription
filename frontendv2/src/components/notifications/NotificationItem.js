import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import '../../css/general.css'
import'../../css/notifications.css'

const NotificationItem = React.memo(({notification}) => {
  console.log(notification)
  const {UserProfile} = useContext(AuthContext)
  const otherUser = notification.creator.pk === UserProfile.id ? notification.user : notification.creator
  const isCreator = notification.creator.pk === UserProfile.id ? true : false

  const actionType = notification.type.split(' ')
  const action = actionType[0]
  const type = actionType[1]

  return (
    <div className='notification-item-wrapper w-100 padding-10'>
      <Link to={`/user/${otherUser.username}`}>
      <div className='h-100 display-inline'>
        <div className='noti-profile-img-wrapper'>
          <img className='noti-profile-img' src={otherUser.pic} alt={otherUser.username}/>
        </div>
      </div>
      <div className='display-inline'>
        <p className='margin-0 profile-username'>{otherUser.username}</p>
        {notification.type !== 'follow' && notification.type !== 'purchase subscription' && notification.type !== 'refund' &&
           <p className='margin-0'>{isCreator ? `${action}ed one of your ${type}s!` : `You ${action}ed one of their ${type}s!` }</p>
        }

        {notification.type === 'follow' && notification.type === 'subscritption' &&
          <p className='margin-0'>{isCreator ? `followed you!` : 'You followed them!' }</p>
        }
        
        {notification.type === 'subscription' &&
          <p className='margin-0'>{isCreator ? `Subscribed to you!` : 'You subscribed to them'}</p>
        }
       
      </div>
      </Link>
    </div>
  )
})

export default NotificationItem