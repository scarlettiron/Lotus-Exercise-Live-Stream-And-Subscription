import React, {useContext, useRef, createRef, useEffect, useState} from 'react'
import PrivateSocketContext from '../../context/PrivateSocketContext'
import MessageContainer from './MessageContainer'
import VideoCallContainer from './VideoCallContainer'

import '../../css/chat.css'

const MessageCallWrapper = ({loadingMessages, getNextPageOfMessages, thread}) => {

    const {callAccepted, calling} = useContext(PrivateSocketContext)
  
    return (
    <div className='chat-container'>
        
         {calling && <VideoCallContainer />}
        {callAccepted && <VideoCallContainer/>}

        {!calling && !callAccepted &&
        <MessageContainer 
        loading={loadingMessages} 
        getNextPageOfMessages={getNextPageOfMessages}
        />
      }  
    </div>
  )
}

export default MessageCallWrapper