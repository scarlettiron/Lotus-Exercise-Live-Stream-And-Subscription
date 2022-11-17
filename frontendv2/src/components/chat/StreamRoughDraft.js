import React, {useContext, useEffect, useRef} from 'react'
import AuthContext from '../../context/AuthContext'
import PrivateSocketContext from '../../context/PrivateSocketContext'

const StreamRoughDraft = () => {

  const {UserProfile} = useContext(AuthContext)

  const {localVideo, remoteVideo, 
    stream, handleMakeCall, handleAcceptCall, call, peerSignal}
    = useContext(PrivateSocketContext)


  return (
    <div>
    <h1>hello again</h1>
    <div className="flexChild" id="camera-container">
        <div className="camera-box">
            <video ref={remoteVideo} className='temp' id="received_video"
             autoPlay></video>

            {stream &&
            <video  ref={localVideo} className='temp' id="local_video" 
            autoPlay muted></video>
            }

            <button id="hangup-button" onClick={handleMakeCall}>Make Call</button>
            {call.current.status === true && call.current.caller !== UserProfile.id &&
              <button onClick={()=> handleAcceptCall()}>Accept call</button>
            }
        </div>
    </div>
</div>
  )
}

export default StreamRoughDraft