import React, {useContext, useState, useEffect, useCallback} from 'react'
import AuthContext from '../../context/AuthContext'
import PrivateSocketContext from '../../context/PrivateSocketContext'
import CustomFetch from '../../utils/CustomFetch'
import { useParams } from 'react-router-dom'
import { chatUrls} from '../../utils/BaseInfo'
import SideBar from '../../components/navbars/SideBar'
import ThreadContainer from '../../components/chat/ThreadContainer'
import MessageContainer from '../../components/chat/MessageContainer'
import VideoCallContainer from '../../components/chat/VideoCallContainer'


const Chat = React.memo(() => {
    /// socket and peer context ///
    const {messages, handleInitialMessagesState, handleMessagesResultsState, 
        calling, callAccepted, setContextThread} = useContext(PrivateSocketContext)

    const {UserProfile} = useContext(AuthContext) 
    const {threadid} = useParams()
    const [thread, setThread] = useState(() => threadid)

    const {listCreateThread, getThreadMessages} = chatUrls

    const [loadingMessages, setLoadingMessages] = useState(()=> !thread.includes('new') ? true : false)
    const [loadingThreads, setLoadingThreads] = useState(() => true)
    const [threads, setThreads] = useState(() => [])  



    const handlePaginateThreads = useCallback(async () => {
        if(!threads.next) return
        const fetchConfig = {method:'get'}
        const {response, data} = await CustomFetch(threads.next, fetchConfig)
        if (response.status === 200){
            setThreads((oldArray)=>({
                ...oldArray, results:[...oldArray.results, ...data.results], 
                next:data.next, previous:data.previous
            }))
        } 

    },[thread, setThreads, threads, setThread])


    const getThreads = useCallback(async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(listCreateThread.url, fetchConfig)
        if(response.status === 200){
            setThreads(data)
            setLoadingThreads(()=>false)
        }
    }, [threadid])

    const getMessages = useCallback(async () => {
        const fetchConfig = {method:'GET'}
        const url = threadid.includes('new') ? `${getThreadMessages.url}/${thread}` : `${getThreadMessages.url}/${threadid}`
        const {response, data} = await CustomFetch(url, fetchConfig)
        if(response.status === 200){
            data.results = data.results.reverse()
            handleInitialMessagesState(data)
            setLoadingMessages(()=> false)
        }
    }, [threadid, thread, setThread])

    const handleCreateThread = useCallback(async () => {
        const userId = thread.split('-')[1]
        const fetchConfig = {method:'POST', body:JSON.stringify({
            user1:UserProfile.id, user2:userId})}
        
        const {response, data} = await CustomFetch(listCreateThread.url, fetchConfig)
        if (response.status === 201) {
            setThread(data.pk)
            setContextThread(data.pk)
        }
    }, [threadid])


    //get next page of messages
    const getNextPageOfMessages = async () => {
        if(!messages.next) return
        const fetchConfig = {method :'GET'}
        const {response, data} = await CustomFetch(messages.next, fetchConfig)
        if(response.status === 200){
        data.results = data.results.reverse()
        handleMessagesResultsState(data)
        }
    }

    useEffect(()=>{
        if(threadid && threadid.includes('new')){
            handleCreateThread()
            getThreads()
        }
        else{
            if(!thread) return
            setContextThread(()=>threadid)
            getMessages()
            getThreads()
        }
    }, [thread, setThread, threadid, setContextThread, getThreads])



  return (
    <div className='main-container'>
        <div className='main-wrapper'>
                    <SideBar chat={true}/>
            <div className='display-inline'>
                {calling && <VideoCallContainer />}
                {callAccepted && <VideoCallContainer/>}

                {!calling && !callAccepted &&
                <MessageContainer 
                loading={loadingMessages} 
                getNextPageOfMessages={getNextPageOfMessages}
                thread={thread}
                />
                }  
            </div>
            
             <div className='display-inline'>
                <ThreadContainer 
                loading={loadingThreads} 
                User={UserProfile} 
                threads={threads}
                handlePaginateThreads={handlePaginateThreads}
                />
            </div> 
        </div>
    </div>
  )
})

export default Chat