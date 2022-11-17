import React, {useRef, createRef, useEffect, useContext, useState} from 'react'
import AuthContext from '../../context/AuthContext'
import {w3cwebsocket as w3cSocket} from 'websocket'
import { useParams } from 'react-router-dom'
import { socketUrls } from '../../utils/BaseInfo'

import '../../css/general.css'
import '../../css/private_call.css'

const PrivateLiveVideoCall = () => {
    const {UserProfile} = useContext(AuthContext)
    const {thread, user1, user2} = useParams()
    const otherUser = user1 === UserProfile.id ? user2 : user1
    const {PrivateLiveVideoCall} = socketUrls

    //for stream
    const [stream, setStream] = useState(null)
    const tracks = useRef(null)

    const handleSetUpStream = async () => {
        let currentStream = await navigator.mediaDevices({video:true, audio:true})
        setStream(currentStream)
        tracks.current = {video:true, audio:true}
        local_video.current.src = currentStream
    }

    //for video display//
    const received_video = createRef()
    const local_video = createRef()

    //for sockets//
    const socket = useRef(null)
    const socketConnected = useRef(false)

    //for peer connections //
    const localPeerConnection = useRef(null)
    
    const setUpLocalPeerConnection = () =>{
        createPeerConnection()
    }

    const createPeerConnection = () => {
        localPeerConnection.current = new RTCPeerConnection({
            iceServers: [     // Information about ICE servers - Use your own!
              {
                urls: "stun:stun.stunprotocol.org"
              }
            ]
        });
      
/*         localPeerConnection.current.onicecandidate = handleICECandidateEvent;
        localPeerConnection.current.ontrack = handleTrackEvent;
        localPeerConnection.current.onnegotiationneeded = handleNegotiationNeededEvent;
        localPeerConnection.current.onremovetrack = handleRemoveTrackEvent;
        localPeerConnection.current.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
        localPeerConnection.current.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
        localPeerConnection.current.onsignalingstatechange = handleSignalingStateChangeEvent; */
    }

    const sendMessage = (msg) => {
        let message = JSON.stringify({'type':'iceCandidate', 'message':message})
        socket.current.send(message)

    }


    //initial socket setup
    useEffect(()=>{
        if(socketConnected.current){return}
        const protocol = window.location.protocol === 'http' ? 'ws://' : 'wss://'
        const socketConnectUrl = `${protocol}${PrivateLiveVideoCall}${thread}`
        const newCallSocket = new w3cSocket(socketConnectUrl)
        
        newCallSocket.onclose = () => {
            console.log('socket closed')
            socketConnected.current = false
            socket.current = null
            socket.close()  
        }

        newCallSocket.onerror = (error) => {
            console.log(error)
            socketConnected.current = false
            socket.current = null
            socket.close()  
        }

        newCallSocket.onopen = () => {
            socket.current = newCallSocket
            socketConnected.current = true 
        }

        console.log(socket.current)

        return () => {newCallSocket.close()}

    }, [thread, socketConnected])


    //initialize local stream
    useEffect(()=>{
        handleSetUpStream()
    }, [])
  
    return (
    <div>
        <h1>hello again</h1>
        <div className="flexChild" id="camera-container">
            <div className="camera-box">
                <video ref={received_video} className='temp' id="received_video"
                 autoPlay></video>

                <video ref={local_video} className='temp' id="local_video" 
                autoPlay muted></video>

                <button id="hangup-button" disabled>Hang Up</button>
            </div>
        </div>
    </div>
  )
}

export default PrivateLiveVideoCall