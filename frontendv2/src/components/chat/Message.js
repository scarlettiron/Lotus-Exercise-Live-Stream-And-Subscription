import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContext'


const Message = ({message, status='sent', thread}) => {
    const {UserProfile} = useContext(AuthContext)
    const sender = thread.user1.pk === message.sender ? thread.user1 : thread.user2
    const receiver = thread.user1.pk === message.sender ? thread.user2 : thread.user1

  return (
    <div className={message.sender === UserProfile.id ? 'message-wrapper sender-wrapper' : 'message-wrapper'}>
        <div className={message.sender === UserProfile.id ? 'message-container sender-message-bg' : 'message-container receiver-message-bg'}>
            {message.is_call ?
                <p className='message-body'>
                    {sender.pk === UserProfile.id ? 
                    `You called ${receiver.username}` : `${sender.username} called you`}
                </p>
                :
                <p className='message-body'>{message.body}</p>

            }
        </div>
        {status === 'pending' && <p className='text-secondary'>Sending</p>}
    </div>
  )
}

export default React.memo(Message)