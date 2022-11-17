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
import '../../../css/buttons-inputs.css'

const EditBannerImg = () => {
    const {UserProfile, handleSetUserProfile} = useContext(AuthContext)
    const [banner, setBanner] = useState(() => UserProfile.banner)
    const [error, setError] = useState(() => false)
    const [loading, setLoading] = useState(() => false)


    const handleUpdateImg = async (e) => {
        const file = e.target.files[0]
        if(!file) return
        setLoading(true)

        const filePath = URL.createObjectURL(file)

        const payload = new FormData()
        payload.append('banner', file)

        const fetchConfig = {method:'PUT', body:payload}
        const {response, data} = await CustomFetch(`${userProfileUrl}${UserProfile.username}/`, 
                                                    fetchConfig, true)
        if(response.status === 200){
            handleSetUserProfile(data)
            setBanner(() => filePath)
        }
        else{
            setError(true)
        }
        setLoading(false)
    }
  return (
    <div>
        <div className='edit-btn-wrapper'>
            <FileInput 
            id='banner' 
            labelText={<Camera className='edit-svg display-inline'/> } 
            onChange={(e) => {handleUpdateImg(e)}}
            classWrapper={'edit-btns'}
            />
        </div>
        
        <div className='banner-wrapper'>
            {loading ? <LoadingSpinner1/>
            :
            <img className='banner-img' src={banner} alt={UserProfile.username}/>
            }
        </div>

        </div>
  )
}

export default EditBannerImg