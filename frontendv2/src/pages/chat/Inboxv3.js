import React, {useContext, useState, useEffect, useRef} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import { useParams } from 'react-router-dom'
import { chatUrls, siteUrl } from '../../utils/BaseInfo'
import SideBar from '../../components/navbars/SideBar'
import ThreadContainer from '../../components/chat/ThreadContainer'
import MessageContainer from '../../components/chat/MessageContainer'
import {w3cwebsocket as w3cSocket} from 'websocket'

const Inboxv3 = () => {
    const {UserProfile} = useContext(AuthContext) 
    const {thread} = useParams()

    const {listCreateThread, getThreadMessages, getThreadMessagesOptimized} = chatUrls

    const loadingMessages = useRef(thread ? true : false)
    const loadingThreads = useRef(true)
    const [threads, setThreads] = useState([])  
    const [messages, setMessages] = useState([])
    const socketConnected = useRef(false)
    const socket = useRef(null)


    const getThreads = async () => {
        let fetchConfig = {method:'GET'}
        let {response, data} = await CustomFetch(listCreateThread.url, fetchConfig)
        if(response.status === 200){
            setThreads(data)
            loadingThreads.current = false
        }
    }

    //works with optimized api path 
/*     const getMessagesAndThreads = async () => {
        let fetchConfig = {method:'GET'}
        let {response, data} = await CustomFetch(`${getThreadMessagesOptimized.url}${thread}`, fetchConfig)
        if(response.status === 200){
          setMessages(data)
          setThreads(data.all_threads)
          loadingThreads.current = false
          loadingMessages.current = false
        }
    } */

    const getMessages = async () => {
        let fetchConfig = {method:'GET'}
        let {response, data} = await CustomFetch(`${getThreadMessages.url}/${thread}`, fetchConfig)
        if(response.status === 200){
            data.results = data.results.reverse()
            setMessages(data)
            loadingMessages.current = false
        }
    }

    //append new message to messages array
    const updateMessagesState = (newMessage) => {
        setMessages(oldArray => ({...oldArray, count:messages.count + 1, 
            results:[...oldArray.results, newMessage]}))
    }

    //send message by way of socket
    const sendSocketMessage = (data) => {
        const message = JSON.stringify({'type':'chat_message', id:data.id, 
        body:data.body, data:data.date, sender:data.sender, thread:thread})
        socket.current.send(message)
    }

    //get next page of messages
    const getNextPageOfMessages = async () => {
        console.log('getting more messages')
        let fetchConfig = {method :'GET'}
        let {response, data} = await CustomFetch(messages.next, fetchConfig)
        if(response.status === 200){
        data.results = data.results.reverse()
        setMessages(oldArray => ({...oldArray, 
            results:[...data.results, ...oldArray.results], 
            next:data.next, previous:data.previous}))
        }
    }

    useEffect(()=>{
        if(thread){
            getMessages()
            getThreads()
        }
        else{
            getThreads()
        }
    }, [thread])

    //setup socket in a way that, if there is an error the app will try and 
    //reconnect another socket
    useEffect(()=>{
        if(thread){
            if(socketConnected.current === true) return
           
            //setup socket
            const webSocketProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
            const webSocketURl = `${webSocketProtocol}${siteUrl}/ws/chat/${thread}/`
            console.log(webSocketURl)
            const newsocket = new w3cSocket(webSocketURl)
            socket.current = (newsocket)

            //handle socket events
            socket.current.onopen = ()=>{socketConnected.current = true}
            
            socket.current.onmessage = (message) => {
                let appendedMessage = JSON.parse(message.data)
                updateMessagesState(appendedMessage)
            }
            
            socket.current.onerror = (error)=>{socketConnected.current = false}
            
            socket.current.onclose = ()=> {socketConnected.current = false}
            
            return () => socket.current.close()
        }
    }, [socketConnected])



  return (
    <div className='main-container'>
        <div className='main-wrapper'>
            <div className='display-inline'>
                <SideBar/>
            </div>
            <div className='display-inline'>
                <MessageContainer 
                loading={loadingMessages} 
                User={UserProfile} 
                messages={messages}
                updateMessagesState={updateMessagesState} 
                sendSocketMessage={sendSocketMessage}
                getNextPageOfMessages={getNextPageOfMessages}/>
            </div>
            <div className='display-inline'>
                <ThreadContainer loading={loadingThreads} User={UserProfile} threads={threads}/>
            </div>
        </div>
    </div>
  )
}

export default Inboxv3