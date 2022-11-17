import React, {useState, useContext} from 'react'
import CustomFetch from '../../../utils/CustomFetch'
import AuthContext from '../../../context/AuthContext'
import { userProfileUrl} from '../../../utils/BaseInfo'
import { ReactComponent as Camera } from '../../../assets/camera2.svg'
import LoadingSpinner1 from '../../loaders/LoadingSpinner1'
import FileInput from '../../general/FileInput'

import '../../../css/general.css'
import '../../../css/posts.css'
import '../../../css/profile.css'

const EditProfileImage = () => {
    const {UserProfile, handleSetUserProfile} = useContext(AuthContext)
    const [profilePic, setProfilePic] = useState(() => UserProfile.pic)
    const [error, setError] = useState(() => false)
    const [loading, setLoading] = useState(() => false)


    const handleUpdateImg = async (e) => {
        const file = e.target.files[0]
        if(!file) return
        setLoading(true)

        const filePath = URL.createObjectURL(file)

        const payload = new FormData()
        payload.append('pic', file)

        const fetchConfig = {method:'PUT', body:payload}
        const {response, data} = await CustomFetch(`${userProfileUrl}${UserProfile.username}/`, 
                                                    fetchConfig, true)
        if(response.status === 200){
            handleSetUserProfile(data)
            setProfilePic(() => filePath)
        }
        else{
            setError(true)
        }
        setLoading(false)
    }

  return (
    <div className='header-links-wrapper justify-content-center margin-20'>
        <div className='profile-picture-wrapper'>
            {loading ? <LoadingSpinner1/>
            :    
            <img className='profile-picture' src={profilePic} alt={UserProfile.username}/>
            }
        </div>
        <div className='edit-profile-pic-btn-wrapper'>
            <FileInput 
            id='profilePic' 
            labelText={<Camera className='edit-svg display-inline'/> } 
            onChange={(e) => {handleUpdateImg(e)}}
            />
        </div>
    </div>
  )
}

export default EditProfileImage