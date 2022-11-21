import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import AuthContext from './AuthContext'
import {chatUrls} from '../utils/BaseInfo'
import CustomFetch from '../utils/CustomFetch'
import {w3cwebsocket as w3cSocket} from 'websocket'
import { socketUrls, serverUrl } from '../utils/BaseInfo'
import Peer from 'simple-peer'


const PrivateSocketContext = createContext()

export default PrivateSocketContext;


export const PrivateSocketProvider = ({children}) => {
    const {getThreadMessages} = chatUrls

    const {UserProfile} = useContext(AuthContext)
    const [contextThread, setContextThread] = useState(null)

    ///for calling ///
    const call = useRef({status:false})
    const [calling, setCalling] = useState(() => false)
    const [callAccepted, setCallAccepted] = useState(() => false)
    const [callDeclined, setCallDeclined] = useState(() => false)

    ////for peer////
    const peerSignal = useRef()
    const peersConnected = useRef()

    ///for streams ///
    
    const stream = useRef(null)
    const localVideo = useRef()
    const remoteVideo = useRef()
    //setup local stream using users camera and microphone
    const setupLocalStream = async () => {
        let currentStream = await navigator.mediaDevices.getUserMedia(
            {video:true, audio:true})
        stream.current = currentStream
        localVideo.current.srcObject = currentStream
    }

    ////for socket///
    const socket = useRef()
    const socketConnected = useRef(false)

    ///for messages state ///
    const [messages, setMessages] = useState(null)

    //for initial message state when page is loaded
    const handleInitialMessagesState = (data) =>{
        setMessages(() => data)
    }

    //for handling pagination
    const handleMessagesResultsState = (data) => {
        setMessages(oldArray => ({...oldArray, 
            results:[...data.results, ...oldArray.results], 
            next:data.next, previous:data.previous}))
    }

    //append new message to messages array
    const addNewMessageToState = (newMessage) => {
        setMessages(oldArray => ({...oldArray, count:oldArray.count + 1, 
            results:[...oldArray.results, newMessage]}))
    }



    //socket functions//
    const sendSocketMessage = (data) => {
        const socketPayload = JSON.stringify({'type':'chat_message',
        body:data.body, sender:data.sender, 
        thread:contextThread, candidateSignal:null})
        socket.current.send(socketPayload)
    }

    const handleSocketActions = (data) => {
        if(data.type === 'chat_message'){
            if(data.sender !== UserProfile.id){
            addNewMessageToState(data)
            }
        }
        if(data.type === 'call_request'){
            if(data.sender !== UserProfile.id){
            setCalling(true)
            call.current = {status:true, caller:data.sender, candidateSignal:data.candidateSignal}
            }
        }
        if(data.type === 'accept_call_request'){
            handleCallAccepted(data)
        }
        if(data.type === 'decline_call_request'){
            if(data.sender !== UserProfile.id){
            addNewMessageToState({
                sender:data.sender,
                thread:data.thread,
                body:null,
                is_call:true
            })
            setCallDeclined(() => true)
            handleCleanup()
            }
        }
        if(data.type === 'call_ended'){
            addNewMessageToState({
                sender:data.sender,
                thread:data.thread,
                body:null,
                is_call:true
            })
            if(data.sender !== UserProfile.id){
                handleCleanup()
            }
        }
    }

    //reset everything 
    const handleCleanup = () =>{
        setCalling(() => false)
        try{
            stream.current.getTracks().forEach(track => {
                track.stop()    
            })
            peerSignal.current.destroy()
        }
        catch{
            console.log('no tracks to stop')
        }

        stream.current = null
        setCallAccepted(() => false)
        call.current = {status:false}
        peersConnected.current = false
        remoteVideo.current = null
        localVideo.current = null

    }
    
    //initiate call to remote user
    const handleMakeCall = async () =>{
        call.current = {status:true, caller:UserProfile.id}
        setCalling(true)

        await setupLocalStream()
        if(stream.current){
        const newPeer = new Peer({initiator:true, trickle:false, stream:stream.current})
        //send peer signal via socket to remote user
        newPeer.on('signal', (data) => { 
            const socketPayload = JSON.stringify({
                type:'call_request',
                sender:UserProfile.id,
                'candidateSignal':data,
                thread:contextThread,
                body:' '
            })
            socket.current.send(socketPayload)
        })

        newPeer.on('error', (error)=>{
            console.log(error)
            handleCleanup()
        })
        newPeer.on('connect', () => {
            console.log('connected')
            peersConnected.current = true
        })

        newPeer.on('stream', (RemoteStream) =>{
            console.log('streaming')
            remoteVideo.current.srcObject = RemoteStream
        })

        peerSignal.current = newPeer
        }
    }

    //handle if call is accepted by call receiver
    const handleCallAccepted = (data) => {
        if(data.sender !== UserProfile.id){
            peerSignal.current.signal(data.candidateSignal)
            setCallAccepted(true)
        }

        peersConnected.current = true
    }

    //handle accepting call be sending a peer connection signal
    const handleAcceptCall = async () => {
        setCallAccepted(true)
        await setupLocalStream()
        if(stream.current){
        const newPeer = new Peer({initiator:false, trickle:false, stream:stream.current})

        newPeer.on('signal', (data) =>{
            const socketPayload = JSON.stringify({
                type:'accept_call_request',
                sender:UserProfile.id,
                candidateSignal:data,
                thread:contextThread,
                body:' '
            })
            socket.current.send(socketPayload)
        })

        newPeer.on('error', (error)=>{
            console.log(error)
            handleCleanup()
        })
        newPeer.on('connect', () => {
            console.log('connected')
            peersConnected.current = true
        })
        
        newPeer.on('stream', (remoteStream) =>{
            remoteVideo.current.srcObject = remoteStream
            peersConnected.current = true
        })

        newPeer.signal(call.current.candidateSignal)
        peerSignal.current = newPeer
        }
    }


    const handleEndCall = () => {
        handleCleanup()
        const socketPayload = JSON.stringify({
            type:'call_ended',
            sender:UserProfile.id,
            candidateSignal:null,
            thread:contextThread,
            body:' '
        })
        socket.current.send(socketPayload)
    }

    const handleDeclineCall = () => {
        handleCleanup()
        const socketPayload = JSON.stringify({
            type:'decline_call_request',
            sender:UserProfile.id,
            candidateSignal:null,
            thread:contextThread,
            body:' '
        })
        socket.current.send(socketPayload)

    }

    //export data
    const socketContextData = {
        handleDeclineCall:handleDeclineCall,
        handleEndCall:handleEndCall,
        setContextThread:setContextThread,
        contextThread:contextThread,
        peerSignal:peerSignal,
        peersConnected:peersConnected,
        socket:socket,
        socketConnected:socketConnected,
        messages:messages,
        setMessages:setMessages,
        handleInitialMessagesState:handleInitialMessagesState,
        handleMessagesResultsState:handleMessagesResultsState,
        addNewMessageToState:addNewMessageToState,
        sendSocketMessage:sendSocketMessage,
        setupLocalStream:setupLocalStream,
        remoteVideo:remoteVideo,
        localVideo:localVideo,
        handleMakeCall:handleMakeCall,
        handleAcceptCall:handleAcceptCall,
        call:call,
        calling:calling,
        callAccepted:callAccepted,
        callDeclined:callDeclined,
        stream:stream,
        

    }


    

    //connect socket when thread is viewed
    //setup socket in a way that, if there is an error the app will try and 
    //reconnect another socket
    useEffect(()=>{
        // to avoid multiple sockets from being opened
        if(!UserProfile | !contextThread){return}

        /* if(socketConnected.current === true) return
 */
        const {PrivateChatCallSocket} = socketUrls
        const socketProtocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
        const socketConnectUrl = `${socketProtocol}${serverUrl}/${PrivateChatCallSocket.url}${contextThread}/`
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
            console.log('socket open')
            socketConnected.current = true
        }

        newSocket.onmessage = ({data}) => {
            let parsedData = JSON.parse(data)
            handleSocketActions(parsedData)
        }

        socket.current = newSocket

        return () => socket.current.close()

        
    },[contextThread, socketConnected, UserProfile, setContextThread])


  return (
    <PrivateSocketContext.Provider value={socketContextData}>
        {children}
    </PrivateSocketContext.Provider>
  )
}
