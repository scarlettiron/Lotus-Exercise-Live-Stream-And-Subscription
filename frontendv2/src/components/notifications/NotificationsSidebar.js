import React, {useState, useEffect, useRef} from 'react'
import CustomFetch from '../../utils/CustomFetch'
import {userNotificationsUrls} from '../../utils/BaseInfo'
import LoadingSpinner from '../general/LoadingSpinner'
import Button2 from '../general/Button2'
import {ReactComponent as ArrowDown} from '../../assets/chevron-down-circle.svg'
import NotificationItem from './NotificationItem'

import '../../css/general.css'
import '../../css/navbars.css'
import '../../css/notifications.css'

const NotificationsSidebar = ({handleToggleNotifications}) => {

    const [notifications, setNotifications] = useState(() => [])
    const [loading, setLoading] = useState(() => true)
    const {viewAllNotifications} = userNotificationsUrls
    const observer = useRef()

    const getNotifications = async () =>{
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(viewAllNotifications.url, fetchConfig)
        if(response.status === 200){
            setNotifications(() => data)
            setLoading(false)
        }
    } 

    const handlePaginateNotifications = async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(notifications.next, fetchConfig)
        if (response.status === 200){
            setNotifications(oldArray => ({
                ...oldArray, next:data.next, 
                results:[...oldArray.results, ...data.results]
            }))
        }
    }

    const handleTrackPosition = element => {
      if(!notifications.next) return
      if(observer.current) {observer.current.disconnect()}
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting){
          handlePaginateNotifications()
        }
      })
      if(element) {observer.current.observe(element)}
    }

    useEffect(()=> {
        getNotifications()
    },[])

  return (
    <div className='side-notifications-bar temp'>
        <div className='justify-content-between margin-10'>
            <h3 className='title-primary-text'>Notifications</h3>
            <Button2 text={<ArrowDown />} action={handleToggleNotifications}/>
        </div>

        {loading && 
        <>
            <div className='w-100 justify-content-center'>
                <LoadingSpinner/>
            </div>
        </>
        }

        {notifications && notifications.count === 0 &&
            <>
                <div className='w-100 justify-content-center'>
                    <p>Nothing to show</p>
                </div>
            </>
        } 

        {notifications && notifications.count > 0 &&
            notifications.results.map((noti, index) => {
                return <NotificationItem key={index} notification={noti} />
            })
        }
        <div ref={observer}></div>
    </div>
  )
}

export default NotificationsSidebar