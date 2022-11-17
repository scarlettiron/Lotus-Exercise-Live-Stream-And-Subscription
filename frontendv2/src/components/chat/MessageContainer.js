import React, {useRef, createRef, useEffect, useContext} from 'react'
import PrivateSocketContext from '../../context/PrivateSocketContext'
import AuthContext from '../../context/AuthContext'
import LoadingSpinner from '../general/LoadingSpinner'
import Message from './Message'
import NewMessageInput from './NewMessageInput'
import MessageContainerHeader from './MessageContainerHeader'
import CallNotificationPopup from './CallNotificationPopup'
import '../../css/chat.css'

const MessageContainer = ({loading, getNextPageOfMessages}) => {
  const {UserProfile} = useContext(AuthContext)
  const {messages, call} = useContext(PrivateSocketContext)

  const displaySendingPopup = useRef(null)
  const initialMount = useRef(true)
  const scrollDiv = createRef()

  const scrollToBottom = () => {
    scrollDiv.current.scrollTop = scrollDiv.current.scrollHeight
  }

  const handleScroll = () => {
    if(initialMount.current){
    initialMount.current = false
    }
  }

  const observer = useRef()

  const handleTrackPosition = element => {
    if(!messages.next) return
    if(observer.current) {observer.current.disconnect()}
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        if(scrollDiv != null && scrollDiv.current.scrollTop <= 40){
          getNextPageOfMessages()
      }
      }
    })
    if(element) {observer.current.observe(element)}
  }



  useEffect(()=>{
    if(loading.current && !messages) return
    if(initialMount.current && messages){
    scrollToBottom()
    }
  }, [messages, loading])



  return (
        <div className='chat-container'>
        
         {!loading.current && messages &&
          <MessageContainerHeader User={UserProfile} thread={messages.thread} />
        } 

        {loading.current && <LoadingSpinner/>}
       <div className='messages-wrapper'>
       <div className='messages-container' onScroll={handleScroll} ref={scrollDiv}>
    
           {loading.current && 
            <div className='paginate-loader'>
              <LoadingSpinner/>
            </div>
          } 

        {messages && messages.count > 0 &&
          messages.results.map((message, index) => 
          { if(index === 0){ 
                return <div ref={handleTrackPosition} key={index}>
                          <Message message={message} User={UserProfile}/>
                        </div>
              }
            return <Message message={message} User={UserProfile} key={index} />
          })
        }

        {displaySendingPopup.current &&
          <Message message={displaySendingPopup.current} user={UserProfile} status = 'pending' />
        }
        { call.current.status &&
          <CallNotificationPopup />
        }
        </div>
      </div>

      {!loading.current &&
        <div className='input-container'>
          <NewMessageInput
          displaySendingPopup={displaySendingPopup}/>
        </div>
      }
    </div> 
  )
}

export default MessageContainer