import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import AuthContext from './AuthContext'
import {w3cwebsocket as w3cSocket} from 'websocket'
import { socketUrls, serverUrl} from '../utils/BaseInfo'
import Peer from 'simple-peer'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


const PublicClassSocketContext = createContext()

export default PublicClassSocketContext;


export const PublicClassSocketProvider = ({children}) => {
  const history = useHistory()

  const {UserProfile} = useContext(AuthContext)
  const is_instructor = useRef(null)
  const [thread, setThread] = useState(null)
  const [classInfo, setClassInfo] = useState(null)

  const handleSetThread = (id) => {setThread(id)}
  const handleSetClassInfo = (classInfo) => {setClassInfo(classInfo)}


  //for sockets
  //url for socket connection
  const {groupClassSocket} = socketUrls
  //socket instance
  const socket = useRef(null)
  //check if socket is actively connected
  const socketConnected = useRef(false)

  //umbrella function which determines what action to proceed
  // with based on message type

  const handleSocketActions = (socketData) => {
    //inquiree from viewer if instructor has already logged on
    if(socketData.type === 'is_instructor_logged_on'){
      if(!is_instructor.current) return
      //if current user is instructor, emit socket message stating instructor is
      //logged on
      const socketPayload = {
        type:'instructor_logged_on',
        body:null, 
        sender:UserProfile.id,
        receiver:socketData.sender, 
        thread:thread, 
        candidateSignal:null,
        instructor_logged_on:true  
      }
      sendSocketMessage(socketPayload)
    }

    if(socketData.type === 'instructor_logged_on'){
      if(is_instructor.current) return
      //if current user is not the instructor
      //initiate peer connection signal from viewer to instructor
      initiatePeerSignal()
    }

    if(socketData.type === 'call_request'){
      if(!is_instructor.current) return 
      acceptPeerCallSignal(socketData)
    }

    if(socketData.type === 'accept_call_request'){
      //handle peer if user is not instructor
      if(!is_instructor.current){
        instructorAcceptedCall(socketData)
      }
    }

    if(socketData.type === 'instructor_left'){
      if(is_instructor) return
      handleLeaveClass()
    }

  }
  
//send socket message function
const sendSocketMessage = (data) => {
  const socketPayload = JSON.stringify(
    { type:data.type,
      body:data.body, 
      sender:data.sender,
      receiver:data.receiver, 
      thread:thread, 
      candidateSignal:data.candidateSignal,
      instructor_logged_on:data.instructor_logged_on
    })
  socket.current.send(socketPayload)
}
  
  

    ////for peer////

  //ref for local peer
  const localPeer = useRef()
  //ref for all peers, this is only applicable if user is instructor
  const remotePeerArray = useRef([])

  //ref for instructor video
  const instructorRef = useRef()

  //add new peer signals and viewer information to peerArray
  const addRemotePeerToArray = (peer, user) => {remotePeerArray.current.push({peer:peer, userId:user})}


  //initialize peer call signal from viewer to instructor
  const initiatePeerSignal = () => {
    const newPeer = new Peer({initiator:true, trickle:false})

    newPeer.on('signal', (data) => {
      const socketPayload = {
        type:'call_request',
        sender:UserProfile.id,
        receiver:classInfo.classPackage.user.id,
        thread:thread,
        candidateSignal:data,
        body:null,
        is_instructor:null
      }
      sendSocketMessage(socketPayload)
    })

    newPeer.on('error', (error)=>{
      console.log(error)
    })

    newPeer.on('connect', () => {
      //send that peer is connected
      console.log('connected')
    })

    newPeer.on('stream', (remoteStream) => {
      instructorRef.current.srcObject = remoteStream
    })

    localPeer.current = newPeer
  }


  //handle accept call by sending peer signal from instructor to viewer
  const acceptPeerCallSignal = async (socketData) => {
    if(!stream.current){await setupLocalStream()}
    
    const newPeer = new Peer({initiator:false, trickle:false, stream:stream.current})

    newPeer.on('signal', (data) => {
      const payload = {
        type:'accept_call_request',
        sender:UserProfile.id,
        receiver: socketData.sender,
        thread:thread,
        candidateSignal:data,
        body:null,
        is_instructor:null 
      }
      sendSocketMessage(payload)
    })

    newPeer.on('error', (error)=>{console.log(error)})

    newPeer.on('connect', () => {
      console.log('connected')
    })

    newPeer.on('stream', () => {console.log('streaming')})

    newPeer.signal(socketData.candidateSignal)
    
    addRemotePeerToArray(newPeer, socketData.sender)

  }

  //handle if call was accepted by instructors peer
  const instructorAcceptedCall = (socketData) => {
    console.log('instructor accpeted call')
    localPeer.current.signal = socketData.candidateSignal
  }


    //for stream///
  //if current user is not instructor, stream will be set to this
  const stream = useRef(null)

  //if current user is instructor get user video and audio
  const setupLocalStream = async () => {
    let currentStream = await navigator.mediaDevices.getUserMedia(
        {video:true, audio:true})
    stream.current = currentStream
    instructorRef.current.srcObject = currentStream
    if(is_instructor.current) instructorRef.current.muted = true
    }

    useEffect(()=> {
      if(!UserProfile | !classInfo | !thread) return
      if(socketConnected.current) return

        const socketProtocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
        const socketConnectUrl = `${socketProtocol}${serverUrl}/${groupClassSocket.url}${thread}/`
      
        const newSocket = new w3cSocket(socketConnectUrl)
        newSocket.onerror = (error) => {
          socketConnected.current = false
          console.log(error)
          newSocket.close()
      }

      newSocket.onclose = () => {
          socketConnected.current = false
          console.log('socket closed')
      }

      newSocket.onopen = () => {
        let initialSocketPayload;
        if(is_instructor.current){
          initialSocketPayload = { 
            type:'instructor_logged_on',
            body:null, 
            sender:UserProfile.id,
            receiver:'all', 
            thread:thread, 
            candidateSignal:null,
            instructor_logged_on:'yes'
          }
        }
        else{
          initialSocketPayload = { 
            type:'is_instructor_logged_on',
            body:null, 
            sender:UserProfile.id,
            receiver:classInfo.classPackage.user.id, 
            thread:thread, 
            candidateSignal:null,
            instructor_logged_on:null
          }
        }
        sendSocketMessage(initialSocketPayload)
        socketConnected.current = true
      }

      newSocket.onmessage = ({data}) => {
          let parsedData = JSON.parse(data)
          handleSocketActions(parsedData)
      }

      socket.current = newSocket

      return () => socket.current.close()
    }, [thread, classInfo, UserProfile])

    const handleLeaveClass = () => {
        handleCleanup()
        history.goBack()
    }

    const handleCleanup = () =>{
      if(is_instructor){
      stream.current.getTracks().forEach(track => {
          track.stop()    
      })
      stream.current = null
      remotePeerArray.current.forEach(peer => {peer.destroy()})
      }

      if(localPeer.current) localPeer.current.destroy()

      instructorRef.current = null

      if(is_instructor){
      const socketPayload = {
        type:'instructor_left',
        body:null, 
        sender:UserProfile.id,
        receiver:'all', 
        thread:thread, 
        candidateSignal:null,
        instructor_logged_on:null
      }

      sendSocketMessage(socketPayload)
    }
  }

    //if user is instructor
    useEffect(()=>{
      if(!classInfo) return
      if(stream.current) return
      
      if(is_instructor.current){setupLocalStream()}
      
    }, [classInfo])


    const context = {
      is_instructor : is_instructor,
      handleSetThread:handleSetThread,
      handleSetClassInfo:handleSetClassInfo,
      classInfo:classInfo,
      sendSocketMessage:sendSocketMessage,
      instructorRef:instructorRef,
      handleLeaveClass:handleLeaveClass
  }

  return (
    <PublicClassSocketContext.Provider value={context}>
        {children}
    </PublicClassSocketContext.Provider>
  )
}
