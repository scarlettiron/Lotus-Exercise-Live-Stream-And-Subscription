import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import PrivateSocketContext from '../../context/PrivateSocketContext'
import ProfilePicture from '../profiles/ProfilePicture'
import Button1 from '../general/Button1'
import '../../css/general.css'
import '../../css/chat.css'

const CallNotificationPopup = () => {
    const {UserProfile} = useContext(AuthContext)

    const {handleAcceptCall, messages, handleDeclineCall, call} = useContext(PrivateSocketContext)
    const displayInfo = messages.thread.user1.id === UserProfile.id ? messages.thread.user2 : messages.thread.user1  
    
    return (
    <div className='call-notification-container temp'>
      <div className='call-noti-section'>
        <ProfilePicture user={displayInfo} wrapperClass={'call-noti-profile-pic'}/>
      </div>
      <div className='call-noti-section'>
        <p className='title-secondary-text margin-10'>{displayInfo.username}</p>
      </div>
      <div className='call-noti-section'>
        {call.caller === UserProfile.id ? <p className='text-secondary'>Calling</p>
        :<p className='text-secondary'>Wants to video chat</p>}
      </div>
      <div className='call-noti-section'>
        <Button1 text={'Decline'} btnClass={'bg-red'} action={ handleDeclineCall}/>
        <Button1 text={'Accept'} btnClass={'bg-green'} action={handleAcceptCall}/>
      </div>
    </div>
  )
}

export default CallNotificationPopup