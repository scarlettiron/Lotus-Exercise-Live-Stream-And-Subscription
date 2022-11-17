import React, {useContext, useState, useEffect, useCallback} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import { chatUrls} from '../../utils/BaseInfo'
import SideBar from '../../components/navbars/SideBar'
import ThreadContainer from '../../components/chat/ThreadContainer'
import GeneralHeader from '../../components/general/headers/GeneralHeader'

import { CountRenders } from '../../utils/CountRenders'

const Inbox = React.memo(() => {
    CountRenders('inbox comp')
    const {UserProfile} = useContext(AuthContext) 

    const {listCreateThread} = chatUrls

    const [loadingThreads, setLoadingThreads] = useState(true)
    const [threads, setThreads] = useState([])  


    const getThreads = async () => {
        let fetchConfig = {method:'GET'}
        let {response, data} = await CustomFetch(listCreateThread.url, fetchConfig)
        if(response.status === 200){
            setThreads(() => data)
            setLoadingThreads(() => false)
        }
    }

    const handlePaginateThreads = useCallback(async () => {
        const fetchConfig = {method:'get'}
        const {response, data} = await CustomFetch(threads.next, fetchConfig)
        if (response.status === 200){
            setThreads((oldArray)=>({
                ...oldArray, results:[...oldArray.results, ...data.results], 
                next:data.next, previous:data.previous
            }))
        } 

    },[threads, setThreads])


    useEffect(()=>{
        getThreads()
    }, [])



  return (
    <div className='main-container'>
        <div className='main-wrapper'>
                <SideBar chat={true}/>
            <div className='display-inline'>
                <div className='chat-container inbox'>
                    <GeneralHeader text='Inbox' />
                </div>
            </div>
            
             <div className='display-inline'>
                <ThreadContainer 
                loading={loadingThreads} 
                User={UserProfile} 
                threads={threads}
                handlePaginateThreads={handlePaginateThreads}
                inboxHome={true}
                />
            </div> 
        </div>
    </div>
  )
})

export default Inbox