import React, {useState} from 'react'
import {ReactComponent as ArrowDown} from '../../assets/chevron-down-circle.svg'
import {ReactComponent as ArrowUp} from '../../assets/chevron-up-circle.svg'
import Button2 from '../general/Button2'
import ProfilePicUsernameBtn from '../general/ProfilePicUsernameBtn'
import { convertToFormattedSiteDate, convertToFormattedSiteTime, videoIsActive} from '../../utils/DateFunctions'
import LinkBtn from '../general/LinkBtn'

import '../../css/bookings.css'
import '../../css/profile.css'
import '../../css/general.css'

const AppointmentItem = React.memo(({appointment}) => {

    const [dropDown, setDropDown] = useState(() => false)
    const toggle = () => {setDropDown(!dropDown)}

  return (
    <div className='secondary-wrapper margin-top-20'>
        <div className='session-item-wrapper'>
        {videoIsActive(appointment.packageSessionId.start_time, 
                        appointment.packageSessionId.end_time) &&
        <>
            <div className='justify-content-end'>
                <LinkBtn 
                text={'Class Has Started!'} 
                link={`/attend/class/${appointment.packageSessionId.pk}`}
                btnClass={'bg-green'}
                />
            </div>
        </>
        
        }
            <div className='session-item-drop'>
                <div className='session-info-column'>
                    <p className='title-secondary-text'>Date</p>
                    <p className='text-paragraph'>{convertToFormattedSiteDate(
                                            appointment.packageSessionId.start_time)}
                    </p>
                </div>

                <div className='session-info-column'>
                    <p className='title-secondary-text'>Starts At</p>
                    <p className='text-paragraph'>{convertToFormattedSiteTime(
                        appointment.packageSessionId.start_time)}</p>
                </div>

                <div className='session-info-column'>
                    <p className='title-secondary-text'>Ends At</p>
                    <p className='text-paragraph'>{convertToFormattedSiteTime(
                        appointment.packageSessionId.end_time)}</p>
                </div>

                <Button2 action={toggle} text={dropDown ? <ArrowUp/> : <ArrowDown/> } />
            </div>
            {dropDown && 
            <>
                 
                     {/* <div className='appointment-wrap-item'>  */}
                     <div className='justify-content-center w-100' > 
                        <ProfilePicUsernameBtn 
                        user={appointment.packageSessionId.classPackage.user}
                        link={`user/${appointment.packageSessionId.classPackage.user.username}`}
                        btnClass={'appointment-user-profile'}
                        />
                    </div>
                     {/* <div className='justify-content-end appointment-wrap-item'> */}
                    <div className='justify-content-center w-100'>
                        <p className='text-paragraph'>{appointment.packageSessionId.classPackage.title}</p>
                    </div>
                 
                <div className='session-info-wrapper'>
                    <p className='margin-20 text-paragraph text-indent w-100'>{appointment.packageSessionId.classPackage.description}</p>
                </div> 
            </> }
        </div>
    </div>
  )
})

export default AppointmentItem