import React, {useContext, useState} from 'react'
import PrivateSocketContext from '../../context/PrivateSocketContext'
import AuthContext from '../../context/AuthContext'
import Button1 from '../general/Button1'
import {ReactComponent as MicOn} from '../../assets/mic.svg'
import {ReactComponent as MicOff} from '../../assets/mic-off.svg'
import {ReactComponent as CameraOn} from '../../assets/camera2.svg'
import {ReactComponent as CameraOff} from '../../assets/camera-off.svg'

import '../../css/general.css'
import '../../css/chat.css'
import '../../css/videoChat.css'


const VideoCallContainer = () => {
    const {UserProfile} = useContext(AuthContext)
    const {remoteVideo, localVideo, messages, handleEndCall, stream} = useContext(PrivateSocketContext)
    const displayUser = messages.thread.user1.id === UserProfile.id ? messages.thread.user2
    : messages.thread.user1

    const [muteAudio, setMuteAudio] = useState(() => false)
    const [displayVideo, setDisplayVideo] = useState(() => true)

    const toggleAudio = () => {
        const audioTrack = stream.current.getTracks().find(track => track.kind === 'audio')
        if(audioTrack.enabled){
            audioTrack.enabled = false
            setMuteAudio(true)
        }
        else{
            audioTrack.enabled = true
            setMuteAudio(false)
        }
    }

    const toggleVideo = () => {
        const videoTrack = stream.current.getTracks().find(track => track.kind === 'video')
        if(videoTrack.enabled){
            videoTrack.enabled = false
            setDisplayVideo(false)
        }
        else{
            videoTrack.enabled = true
            setDisplayVideo(true)
        }
    }

    return (
    <div className='chat-container'>
        <video ref={remoteVideo} className='remote-chat-video'autoPlay></video>

        <div className='stream-overlay'>
            <div className='call-with-username'>
                <p className='text-white title-secondary-text'>{displayUser.username}</p>
            </div>
            <div className='local-video-container'>
                <video  ref={localVideo} className='local-video' autoPlay muted></video> 
            </div>
            <div className='stream-controls'>
                <Button1 action={toggleAudio} text={muteAudio ? <MicOff className='stream-btn-svg' viewBox="0 0 24 24"/> : <MicOn className='stream-btn-svg' viewBox="0 0 24 24" />} btnClass={'stream-btn'}/>
                <Button1 text={'End'} btnClass={'bg-red'} action={handleEndCall}/>
                <Button1 action={toggleVideo} text={displayVideo ? <CameraOn className='stream-btn-svg' viewBox="0 0 487 487"/> : <CameraOff className='stream-btn-svg' viewBox="0 0 21 21" />} btnClass={'stream-btn'}/>
            </div>
        </div>
    </div>
  )
}

export default VideoCallContainer