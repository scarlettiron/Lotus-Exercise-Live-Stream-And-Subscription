import React from 'react'


const Message = ({message, User, status='sent'}) => {
/*    const date = new Date(message.date)
   const messageDate = date.toDateString()  */


   const messageStyle = message.sender === User.id ?{
       wrapper : 'message-wrapper sender-wrapper',
       container : 'message-container sender-message-bg'
   } 
   : {
       wrapper :'message-wrapper',
       container : 'message-container receiver-message-bg'
   }

  return (
    <div className={messageStyle.wrapper}>
        <div className={messageStyle.container}>
            <p className='message-body'>{message.body}</p>
        </div>
        {status === 'pending' && <p className='text-secondary'>Sending</p>}
    </div>
  )
}

export default Message