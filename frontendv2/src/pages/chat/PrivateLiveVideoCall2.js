import React, {useRef, createRef, useEffect, useContext, useState} from 'react'
import AuthContext from '../../context/AuthContext'
import {w3cwebsocket as w3cSocket} from 'websocket'
import { useParams } from 'react-router-dom'
import { socketUrls, siteUrl } from '../../utils/BaseInfo'
import Peer from 'simple-peer'


import '../../css/general.css'
import '../../css/private_call.css'

const PrivateLiveVideoCall2 = () => {

    const {UserProfile} = useContext(AuthContext)
    const {thread, user1, user2} = useParams()
    const otherUser = user1 === UserProfile.id ? user2 : user1
    const {PrivateVideoCallSocket} = socketUrls

    //for stream
    const [stream, setStream] = useState(null)
    const incomingVideo = useRef()
    const localVideo = useRef()
    const tracks = useRef({local:{
        video:{active:true, srcObject:null},
        audio:{active:true, srcObject:null}
    }})

    const handleSetUpStream = async () => {
        console.log('setting up local stream')
        let currentStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
        setStream(currentStream)
        localVideo.current.srcObject = currentStream
        tracks.current.local.video.srcObject = currentStream
    }


    //for sockets//
    const socket = useRef(null)
    const socketConnected = useRef(false)

    //for peer connections //
    const remotePeer = useRef(null)

    const setUpLocalCallingPeerConnection = () =>{
        console.log('settingup local peer')
        const newPeer = new Peer({initiator:true, trickle:false, stream})
        
        //send signal to remote peer
        newPeer.on('signal', (data) =>{
            console.log('peer on signal')
            console.log(data)
            const socketPayload = JSON.stringify({'type':'call_signal', 'caller':UserProfile.id, 'thread':thread,'candidateSignal':data})
            socket.current.send(socketPayload)
        })

        socket.current.onmessage = ({data}) => {
            let parsedData = JSON.parse(data)
            if(parsedData.caller === UserProfile.id){console.log('equals user id')}
            if(parsedData.type === 'call_signal' && parsedData.caller !== UserProfile.id){
                console.log('incoming signal data from socket caller')
                console.log(parsedData.candidateSignal)
                newPeer.signal(parsedData.candidateSignal)
            }
        }

        newPeer.on('stream', (currentStream) =>{
            console.log('ready for stream caller')
            incomingVideo.current.srcObject = currentStream
        } )

        remotePeer.current = newPeer

    }

    const setUpAnswerCallPeerConnection = (socketData) => {
        const newPeer = new Peer({initiator:false, trickle:false, stream})
        console.log(socketData)
        //send signal to remote peer
        newPeer.on('signal', (data) =>{
            console.log('peer on answering signal')
            const socketPayload = JSON.stringify({'type':'call_signal', 'caller':UserProfile.id, 'thread':thread,'candidateSignal':data})
            socket.current.send(socketPayload)
        })

/*         socket.current.onmessage = ({data}) => {
            console.log('message received from socket in peer')
            let parsedData = JSON.parse(data)
            console.log(parsedData.candidateSignal)
            if(parsedData.caller === UserProfile.id){console.log('equals user id')}
            if(parsedData.type === 'call_signal' && parsedData.caller !== UserProfile.id){
                console.log('incoming signal data from socket')
                newPeer.signal(parsedData.candidateSignal)
            }
        }
 */
        console.log(socketData.candidateSignal)
        newPeer.signal(socketData.candidateSignal)
        newPeer.on('stream', (currentStream) =>{
            console.log('ready for stream')
            incomingVideo.current.srcObject = currentStream
        } )

        remotePeer.current = newPeer
    

    }


    //initial socket setup
    useEffect(()=>{
        console.log('use effect before return')
        if(socketConnected.current === true) return
       
        console.log('setting up socket in useeffect')
        const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
        const socketConnectUrl = `ws://${siteUrl}/${PrivateVideoCallSocket.url}${thread}/`
        console.log(socketConnectUrl)
        const newCallSocket = new w3cSocket(socketConnectUrl)
        socket.current = newCallSocket

        socket.current.onclose = () => {
            console.log('socket closed')
            socketConnected.current = false
            socket.current = null
        }

        socket.current.onerror = (error) => {
            console.log(error)
            socketConnected.current = false
            socket.current = null
        }

        socket.current.onopen = () => {
            console.log('socket opened')
            console.log(socket.current)
            socket.current = newCallSocket
            socketConnected.current = true 
        }

        socket.current.onmessage = ({data}) => {
            console.log('message received from socket')
             let parsedData = JSON.parse(data)
            console.log(parsedData)
            if(parsedData.type === 'call_signal' && parsedData.caller !== UserProfile.id){
                setUpAnswerCallPeerConnection(parsedData)
            }
        }

        console.log(socket.current)

        return () => {socket.current.close()}

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
                <video ref={incomingVideo} className='temp' id="received_video"
                 autoPlay></video>

                {stream &&
                <video  ref={localVideo} className='temp' id="local_video" 
                autoPlay muted></video>
                }

                <button id="hangup-button" onClick={setUpLocalCallingPeerConnection}>Send Signal</button>
            </div>
        </div>
    </div>
  )
}

export default PrivateLiveVideoCall2