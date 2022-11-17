import React, {useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import CustomFetch from '../../utils/CustomFetch'
import PublicClassSocketContext from '../../context/PublicClassSocketContext'
import AuthContext from '../../context/AuthContext'
import {bookingUrls} from '../../utils/BaseInfo'

import Button1 from '../../components/general/Button1'
import { CountRenders } from '../../utils/CountRenders'
import LoadingSpinner from '../../components/general/LoadingSpinner'

import '../../css/general.css'
import '../../css/chat.css'
import '../../css/videoChat.css'
import '../../css/live_class.css'

const AttendClass = () => {
  CountRenders('attend class')
  const [loading, setLoading] = useState(() => true)
  const {classSessionDetail} = bookingUrls
  const {threadid} = useParams()
  const {is_instructor, handleSetThread, classInfo,
          handleSetClassInfo, instructorRef, handleLeaveClass} = useContext(PublicClassSocketContext)
  const {UserProfile} = useContext(AuthContext)


  const getClassSessionDetails = async () => {
    const fetchConfig = {method:'GET'}
    const {response, data} = await CustomFetch(`${classSessionDetail.url}/${threadid}/`, fetchConfig)
    if(response.status === 200){
      handleSetClassInfo(data)
/*       setLoading(() => false) */
      if(data.classPackage.user.pk === UserProfile.id){
        is_instructor.current = true
      }
    }
  }


  useEffect(()=>{
    console.log('useeffect in attend class')
    if(threadid){
    handleSetThread(threadid)
    getClassSessionDetails()
    }
  }, [threadid])



  return (
    <div className='video-wrapper'>
{/*       {loading && <LoadingSpinner/>}  */}
      <video ref={instructorRef} className='remote-chat-video'autoPlay></video>
    
      <div className='stream-controls-class'>
        <Button1 text={'Leave Class'} btnClass={'bg-red'} action={handleLeaveClass}/>
      </div>
    </div>

  )
}

export default AttendClass