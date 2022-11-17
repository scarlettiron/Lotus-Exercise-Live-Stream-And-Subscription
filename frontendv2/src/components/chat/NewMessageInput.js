import React, {useRef, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import PrivateSocketContext from '../../context/PrivateSocketContext'
import CustomFetch from '../../utils/CustomFetch'
import { chatUrls} from '../../utils/BaseInfo'
import Button2 from '../general/Button2'
import {ReactComponent as Airplane} from '../../assets/paper-plane.svg'
import TextareaAutosize from 'react-textarea-autosize';
import { CountRenders } from '../../utils/CountRenders'
const NewMessageInput = React.memo(({displaySendingPopup}) => {
    const tag = useRef()
    const {UserProfile} = useContext(AuthContext)
    const {sendSocketMessage, socketConnected, 
        addNewMessageToState, contextThread} = useContext(PrivateSocketContext)

    const {getThreadMessages} = chatUrls
    const messageBody = useRef(null)


    // set message body = to input
    const handleUpdateBody = (e) => {
        messageBody.current = e.target.value
    }


    const handleCreateMessage = async () =>{
        const newMessage = {body:messageBody.current, 
                        thread:contextThread,
                        sender:UserProfile.id
                        }
        displaySendingPopup.current = newMessage

        const fetchConfig = {method:'post', body:JSON.stringify(newMessage)}
        const {response, data} = await CustomFetch(`${getThreadMessages.url}/${contextThread}`, fetchConfig)
        if(response.status === 201){
            displaySendingPopup.current = null
            addNewMessageToState(data)
            tag.current.value = null
            if(socketConnected.current){
                sendSocketMessage(data)
            }
        }
    }



  return (
    <div className='message-input-container'>
        <div className='message-input-wrapper'>
            <TextareaAutosize 
            ref={tag} 
            maxRows={5} 
            className={'message-input'} 
            onChange={handleUpdateBody}
            placeholder='send a message'
            />

            <Button2 text={<Airplane className={'chat-send-btn'} viewBox="0 0 97.103 97.104"/>} 
            action={handleCreateMessage}/>
        </div>
    </div>
  )
})

export default NewMessageInput