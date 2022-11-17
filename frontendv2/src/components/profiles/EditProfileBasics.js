import React, {useState, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import Divider3 from '../general/Divider3'
import Divider2 from '../general/Divider2'
import ProfilePicture from './ProfilePicture'
import ProfileBanner from './ProfileBanner'
import LoadingSpinner from '../general/LoadingSpinner'
import ResponsiveTextArea from '../general/ResizingTextArea'
import Button1 from '../general/Button1'
import EditField from './EditField'
import CustomFetch from '../../utils/CustomFetch'
import { userProfileUrl } from '../../utils/BaseInfo'

const EditProfileBasics = () => {
    const {UserProfile, handleSetUserProfile} = useContext(AuthContext)

    const [loadingBanner, setLoadingBanner] = useState(() => false)
    const [loadingProfilePic, setLoadingProfilePic] = useState(() => false)
    const [loadingBio, setLoadingBio] = useState(() => false)
    const [loadingBasics, setLoadingBasics] = useState(() => false)
    const [firstName, setFirstName] = useState(() => UserProfile.first_name)
    const [lastName, setLastName] = useState(() => UserProfile.last_name)
    const [email, setEmail] = useState(() => UserProfile.email)
    const [bio, setBio] = useState(() => UserProfile.bio)
    const [profilePic, setProfilePic] = useState({'path':UserProfile.pic})
    const [bannerImg, setBannerImg] = useState({'path':UserProfile.banner})
    const [subscriptionUnits, setSubscriptionUnits] = useState(() => UserProfile.subscription_units)



    const controller = new AbortController()
    const signal = controller.signal

    const abort = (setLoading) => {
        controller.abort()
        setLoading(false)
    }

    const handleUpdateState = (e, setVarState) => {
        setVarState(e.target.value)
    }

    const handleUpdatePicState = (e, setVarState, field, setLoading) => {

        const file = e.target.files[0]
        const filePath = URL.createObjectURL(file)

        const newState = {
            'file':file,
            'path':filePath, 
        }

        setVarState(()=>newState)

        handleUpdateImg(file, field, setLoading)
    }

    const handleUpdateImg = async (file, field, setLoading) => {
        setLoading(true)
        const payload = new FormData()
        payload.append(field, file)

        const fetchConfig = {method:'PUT', signal:signal, body:payload}
        const {response, data} = await CustomFetch(userProfileUrl, fetchConfig)
        if(response.status === 200){
            handleSetUserProfile(data)
            setLoading(false)
        }
    }


    const handleUpdateProfileBasics = async () => {
        setLoadingBasics(true)
        const fetchConfig = {method:'PUT', signal:signal, body:
        JSON.stringify({
            'first_name':firstName,
            'last_name':lastName,
            'email':email,
        })
        }
        const {response, data} = await CustomFetch(userProfileUrl, fetchConfig)
        if(response.status === 200){
            handleSetUserProfile(data)
            setLoadingBasics(false)
        }
    }

    const handleUpdateBio = async () => {
        setLoadingBio(true)
        const fetchConfig = {method:'PUT', signal:signal, body:JSON.stringify({'bio':bio})}
        const {response, data} = await CustomFetch(userProfileUrl, fetchConfig)
        if(response.status === 200){
            handleSetUserProfile(data)
            setLoadingBio(false)

        }
    }


return (
    <div className='container'>
        {loadingBanner && <LoadingSpinner btnAction={abort(setLoadingBanner)}/>}
            <div className='edit-btn-wrapper'>
                <Button1 text={'Edit Banner'} action={(e) => {handleUpdatePicState(e, setBannerImg, 'banner', setLoadingBanner)}} />
            </div>
            <ProfileBanner src={bannerImg.path} alt={UserProfile.username}/>
            <div className='header-links-wrapper justify-content-center margin-20'>
                <div className='profile-pic-name-display-wrapper'>
                    {loadingProfilePic && <LoadingSpinner btnAction={abort(setLoadingProfilePic)} />}
                    <ProfilePicture  user={UserProfile}/>
                </div>
                <div className='profile-name'>
                    <Button1 text={'Edit Profile Picture'} action={(e) => {handleUpdatePicState(e, setProfilePic, 'pic', setLoadingProfilePic)}} />
                </div>
            </div>
        <Divider3/>
            {loadingBasics && <LoadingSpinner btnAction={abort(setLoadingBasics)}/> }
            <div className='justify-content-between'>
                <p className='title-secondary-text margin-10'>Edit Bio</p>
                <Button1 text={'Save Bio'} action={handleUpdateBio}/>
            </div>
            <div className='margin-auto w-90 justify-content-center bg-red'>
                <Divider2/>
            </div>
            <Divider2/>
            <div className='margin-auto secondary-wrapper'>
                <ResponsiveTextArea 
                placeholder={'edit bio'} 
                name='bio' 
                value={bio ? bio : 'Edit Bio'}
                onChange={(e)=>{handleUpdateState(e, setBio)}} 
                wrapperClass={'edit-bio-wrapper temp'}
                />
            </div>
        <Divider3/>
        <div className='container'>
            <div className='justify-content-between'>
                <p className='text-paragraph'>Edit Basics</p>
                <Button1 text={'Save Basics'} action={handleUpdateProfileBasics}/>
            </div>
            <EditField label='First Name' id='firstName' value={firstName} onChange={(e)=> {handleUpdateState(e, setFirstName)}} />
            <EditField label='Last Name' id='lastName'  value={lastName} onChange={(e)=> {handleUpdateState(e, setLastName)}} />
            <EditField label='Email' id='email' value={email} onChange={(e)=> {handleUpdateState(e, setEmail)}} type='email'/>
            <EditField label='Phone' id='phone' type='number' />
        </div>
        <Divider3/>
    </div>

  )
}

export default EditProfileBasics