import React, {useContext} from 'react'
import PrivateSocketContext from '../../context/PrivateSocketContext'
import ProfilePicUsernameBtn from '../general/ProfilePicUsernameBtn'
import Button1 from '../general/Button1'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import {ReactComponent as BackArrow} from '../../assets/chevron-left-circle.svg'
import '../../css/chat.css'
import '../../css/general.css'

const MessageContainerHeader = ({User, thread}) => {
    const history = useHistory()
    const {handleMakeCall} = useContext(PrivateSocketContext)
  return (
    <div className='chat-header'>
            <button className='back-btn' onClick={() => history.goBack()}>
                <BackArrow className='back-btn-svg' viewBox="0 0 32 32"/>
            </button>
        <div className='display-inline'>
            <ProfilePicUsernameBtn
                btnClass='chat-profile-pic'
                user={thread.user1.pk === User.id ? thread.user2 
                : thread.user1}
            />
        </div>
        <div className='display-inline'>
            <Button1 text={'Video Chat'} action={()=> handleMakeCall()} />
        </div>
  </div>
  )
}

export default MessageContainerHeader