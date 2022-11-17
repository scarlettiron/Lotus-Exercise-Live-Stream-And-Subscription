import React, {useEffect, useState, useRef, useContext, useCallback} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import LoadingSpinner from '../../components/general/LoadingSpinner'
import { bookingUrls } from '../../utils/BaseInfo'
import SideBar from '../../components/navbars/SideBar'
import GeneralHeader from '../../components/general/headers/GeneralHeader'
import AppointmentItem from '../../components/appointments/AppointmentItem'
import Button5 from '../../components/general/Button5'

import {CountRenders} from '../../utils/CountRenders'
import '../../css/general.css'

const Appointments = () => {
    CountRenders('app page ')

    const {userAppointmentsList} = bookingUrls
    const {UserProfile} = useContext(AuthContext)
    const [appointments, setAppointments]  = useState(() => null)
    const [loading, setLoading] = useState(() => true)
    const [taking, setTaking] = useState(() => false)
    const [teaching, setTeaching] = useState(() => false)
    const [all, setAll] = useState(() => true)


    const handleGetUserAppointments = useCallback( async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(`${userAppointmentsList.url}/${UserProfile.id}`, fetchConfig)
        if(response.status === 200){
            console.log(data)
            setAppointments(() => data)
            setLoading(false)
        }
    }, [UserProfile.id, userAppointmentsList.url])

    const handlePaginateAppointments = useCallback(async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = CustomFetch(appointments.next, fetchConfig)
        if(response.status === 200){
            setAppointments(oldArray => ({
                ...oldArray, results:[...oldArray.results, ...data.results], 
                next:data.next, previous:data.previous})
            )
        }
    }, [appointments])

    const viewTeaching = useCallback(() => {
        setAll(() => false)
        setTeaching(() => true)
        setTaking(() => false)
    },[])

    const viewTaking = useCallback(() => {
        setAll(() => false)
        setTeaching(() => false)
        setTaking(() => true)
    }, [])

    const viewAll = useCallback(() => {
        setAll(() => true)
        setTeaching(() => false)
        setTaking(() => false)
    }, [])

    const observer = useRef()

    const handleTrackPosition = element => {
      if(!appointments.next) return
      if(observer.current) {observer.current.disconnect()}
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting){
          handlePaginateAppointments()
        }
      })
      if(element) {observer.current.observe(element)}
    }
  

    useEffect(() => {
        handleGetUserAppointments()
    }, [handleGetUserAppointments])

  return (
    <div className='main-container'>
        <div className='main-wrapper'>
        <div className='display-inline'>
                    <SideBar/>
                </div>
                <div className='container'>
                    <GeneralHeader text='Calendar' />
                    <div className='justify-content-space-around padding-20'>
                        <div className='display-inline'>
                            <Button5 
                            text={'All'}  
                            action={viewAll} 
                            btnClass={all ? 'active' : null}
                            />
                        </div>
                        <div className='display-inline'>
                            <Button5 
                            text={'Taking'}
                            action={viewTaking}
                            btnClass={taking ? 'active' : null}
                            />
                        </div>
                        <div className='display-inline'>
                            <Button5 
                            text={'Teaching'}  
                            action={viewTeaching} 
                            btnClass={teaching ? 'active' : null}
                            />
                        </div>
                    </div>
                {loading && <LoadingSpinner />}

                {appointments && appointments.count > 0 &&
                    appointments.results.map((app, index) => {
                        if (index + 1 === appointments.results.length && appointments.next){
                            return <React.Fragment key={index}>
                                {all && <AppointmentItem  appointment={app}/>}
                                {taking && !app.is_instructor && <AppointmentItem appointment={app}/>}
                                {teaching && app.is_instructor && <AppointmentItem appointment={app}/>}
                                <div ref={handleTrackPosition}></div>
                                </React.Fragment>
                        }
                        return <React.Fragment key={index}>
                            {all && <AppointmentItem appointment={app}/>}
                            {taking && !app.is_instructor && <AppointmentItem appointment={app}/>}
                            {teaching && app.is_instructor && <AppointmentItem appointment={app}/>}
                            </React.Fragment>
                    })
                }

                </div>
            </div>
    </div>
  )
}

export default Appointments