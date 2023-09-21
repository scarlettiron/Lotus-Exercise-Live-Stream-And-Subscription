import React, {useContext, useState, useEffect} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import {verificationUrls} from '../../utils/BaseInfo'
import SideBar from '../../components/navbars/SideBar'
import Divider1 from '../../components/general/Divider1'
import InstructorVerification from '../../components/profiles/InstructorVerification'
import EditProfileBasicsv2 from '../../components/profiles/EditProfileBasicsv2'
import '../../css/navbars.css'
import '../../css/general.css'
import '../../css/profile.css'

import { CountRenders } from '../../utils/CountRenders'

const EditProfile = React.memo(() => {
    const {UserProfile} = useContext(AuthContext)
    const [verificationInfo, setVerificationInfo] = useState(() => null)
    const {verificationDetail} = verificationUrls

    const getVerificationStatusInfo = async () => {
        const fetchConfig = {method : 'GET'}
        const {response, data} = await CustomFetch(`${verificationDetail.url}/${UserProfile.id}/`, 
                                                    fetchConfig)
        if(response.status === 200){
            setVerificationInfo(() => data)
        }
    }

    useEffect(() => {
        if(!UserProfile.is_instructor){
            getVerificationStatusInfo()
        }
    }, [])
   
return (
    <div>
        <div className='main-container'>
            <div className='main-wrapper'>
                <SideBar/>
                <div className='display-inline'>
                    <div className='container'>
                       <EditProfileBasicsv2 />
                        <Divider1 />
                        <Divider1/>
                        <div className='container'>
                            {!UserProfile.is_instructor && !verificationInfo &&
                                <InstructorVerification />
                            }

                            {!UserProfile.is_instructor && verificationInfo &&
                                <>
                                    <div className='edit-item-wrapper margin-20'>
                                        <p className='text-paragraph'>Instructor Verification Status:</p>
                                        <p className='text-paragraph'>{verificationInfo.status}</p>
                                    </div>
                                </>
                            }

                            {UserProfile.is_instructor && <>
                            <div className='edit-item-wrapper margin-20'>
                                <p className='text-paragraph'>Instructor Verification Status:</p>
                                <p className='text-paragraph'>Verified!</p>
                            </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
})

export default EditProfile