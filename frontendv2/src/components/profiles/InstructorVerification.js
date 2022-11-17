import React, {useState, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import { verificationUrls } from '../../utils/BaseInfo'
import FileInput from '../general/FileInput'
import ImgThumbnail from '../general/ImgThumbnail'
import LoadingSpinner from '../general/LoadingSpinner'
import ErrorBanner from '../general/errors/ErrorBanner'
import SuccessPopup from '../general/SuccessPopup'
import Button1 from '../general/Button1'
import '../../css/general.css'
import '../../css/profile.css'

const InstructorVerification = () => { 
const {UserProfile} = useContext(AuthContext)
const [loading, setLoading] = useState(false)
const [photoId, setPhotoId] = useState(null)
const [certification, setCertification] = useState(null)
const [error, setError] = useState(false)
const [success, setSuccess] = useState(false)

const {verificationCreate} = verificationUrls

const controller = new AbortController()
const signal = controller.signal

const abort = () => {
    controller.abort()
    setLoading(false)
}



const handleSetVarState = (e, setVarState) =>{
    let file = e.target.files[0]
    console.log(file)
    let path = URL.createObjectURL(file)

    let newState = {
        'file': file,
        'path' : path
    }

    setVarState(newState)
}



const handleSendVerificationDetails = async () => {
    if(certification.file && photoId.file){
        setError(() => false)
        setLoading(true)

        let payload = new FormData()
        payload.append('certificate', certification.file)
        payload.append('photoId', photoId.file)
        payload.append('user',UserProfile.id)
        let fetchConfig = {method:'POST', signal:signal, body:payload}

        let {response, data} = await CustomFetch(`${verificationCreate.url}/${UserProfile.id}/`,  
                                                    fetchConfig, true)
        if(response.status === 201) {
            setSuccess(() => true)
            setLoading(false)
        }
        else{
            setError(() => true)
            setLoading(false)
        }
    }
}

return (
    <div>
        {loading && <LoadingSpinner btnAction={abort}/>}
         <div className='justify-content-center'>
            <h2 className='title-secondary-text'> Become an Instructor</h2>
        </div>
        {error && <>
        <div className='justify-content-center'>
            <ErrorBanner message={'ERROR: Please try again later!'}/> 
        </div>
        </> }
        {success && <SuccessPopup/>}

        <div >
            <p className='text-paragraph text-indent'> To become an instructor, please submit a photo
                of any certificate related to the field of content you are planning
                on creating as well as a picture of a photo ID. This is for Verification
                purposes only and will be deleted upon approval or denial.
            </p>
        </div>
        <div className='margin-20'>
            <p className='text-paragraph text-indent'>If you are not a verified instructor, you will be unable
                to do the following:
            </p>
        </div>
        <div className='margin-20'>
            <p className='text-paragraph text-indent'>
                Initialize Live sessions
            </p>
            <p className='text-paragraph text-indent'>
            Add live classes
            </p>
            <p className='text-paragraph text-indent'>
            Set a subscription price
            </p>
            <p className='text-paragraph text-indent'>
            Create paid posts
            </p>

        </div>
        <div className='justify-content-center flex-wrap'>
            <div className='display-inline'>
                {certification &&
                <div className='justify-content-center margin-20' key='certificate'>
                    <ImgThumbnail name={'certificate'} image={certification?.path} wrapperClass={'justify-content-center margin-20'}/>
                </div>
                }
                <div className='justify-content-center margin-20'>
                    <FileInput id='certificateinput' labelText={<p className='text-paragraph edit-btn-text'>Add Certificate</p>} 
                    onChange={(e) => handleSetVarState(e, setCertification)}
                    classWrapper={'edit-profile-responsive-btn-wrapper'}/>
                </div>
            </div>
            <div className='display-inline'>
                {photoId &&
                <div className='justify-content-center margin-20 ' key='photo Id'>
                    <ImgThumbnail name={'photoId'} image={photoId?.path} wrapperClass={'justify-content-center margin-20'}/>
                </div>
                }
                <div className='justify-content-center margin-20' key='photo id input'>
                    <FileInput id='photoidinput' labelText={<p className='text-paragraph edit-btn-text'>Add Photo ID</p>} 
                    onChange={(e)=> handleSetVarState(e, setPhotoId)}
                    classWrapper={'edit-profile-responsive-btn-wrapper'}/>
                </div>
            </div>
        </div>
        <div className='justify-content-center margin-20'>
            <Button1 text={'Submit'} action={handleSendVerificationDetails} />
        </div>
    </div>
  )
}

export default InstructorVerification