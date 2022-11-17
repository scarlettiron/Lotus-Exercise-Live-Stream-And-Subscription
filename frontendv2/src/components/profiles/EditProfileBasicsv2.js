import React, {useContext, useState, useCallback} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import { userProfileUrl, updateSubscriptionPriceUrl } from '../../utils/BaseInfo'
import Button1 from '../general/Button1'
import ResizingTextArea from '../general/ResizingTextArea'
import EditField from './EditField'
import Divider3 from '../general/Divider3'
import LoadingSpinner from '../general/LoadingSpinner'
import LoadingSpinner1 from '../loaders/LoadingSpinner1'
import CurrencyInput from 'react-currency-input-field'
import EditProfileImage from './EditProfile/EditProfileImage'
import EditBannerImg from './EditProfile/EditBannerImg'


import '../../css/general.css'
import '../../css/posts.css'
import '../../css/profile.css'

const EditProfileBasicsv2 = () => {

    const {UserProfile, handleSetUserProfile} = useContext(AuthContext)

    const [loadingBio, setLoadingBio] = useState(() => false)
    const [loadingBasics, setLoadingBasics] = useState(() => false)
    const [loadingSubscription, setLoadingSubscription] = useState(() => false)
    const [firstName, setFirstName] = useState(() => UserProfile.first_name)
    const [lastName, setLastName] = useState(() => UserProfile.last_name)
    const [email, setEmail] = useState(() => UserProfile.email)
    const [bio, setBio] = useState( () => UserProfile.bio)
    const [subscription, setSubscription] = useState(() => UserProfile.subscription_units 
        ? UserProfile.subscription_units
        : 0)
    const [error, setError] = useState(() => false)


    const controller = new AbortController()
    const signal = controller.signal

    const abort = (setLoading) => {
        controller.abort()
        setLoading(false)
    }



    const handleUpdateProfileBasics = useCallback(async () => {
        setLoadingBasics(() => true)
        const fetchConfig = {method:'PUT', signal:signal, body:
        JSON.stringify({
            'first_name':firstName,
            'last_name':lastName,
            'email':email,
        })
        }
        const {response, data} = await CustomFetch(`${userProfileUrl}${UserProfile.username}/`, fetchConfig)
        if(response.status === 200){
            setLoadingBasics(() => false)
            handleSetUserProfile(data)
        }
        else{
            setError(true)
        }
    }, [firstName, setFirstName, lastName, setLastName, email, setEmail])

    const handleUpdateBio = useCallback(async () => {
        setLoadingBio(() => true)
        let payload = JSON.stringify({'bio':bio})
        const fetchConfig = {method:'PUT', signal:signal, body:payload}
        const {response, data} = await CustomFetch(`${userProfileUrl}${UserProfile.username}/`, fetchConfig)
        if(response.status === 200){
            setLoadingBio(() => false)
            handleSetUserProfile(data)
        }
        else{
            setError(true)
        }
    }, [bio, setBio])

    const setPriceUnits = useCallback((value, name) => {
        const priceUnits = value * 100
        if(value > 0){ setSubscription(() => priceUnits) }
    }, [subscription, setSubscription])

    const handleUpdateSubscriptionPrice = useCallback(async () => {
        setLoadingSubscription(true)
        const fetchConfig = { method:'PUT', body:JSON.stringify({price:subscription})}
        const {response, data} = await CustomFetch(`${updateSubscriptionPriceUrl}${UserProfile.id}/`, fetchConfig)
        if(response.status === 200){
           handleSetUserProfile(data)
           setLoadingSubscription(false)
        }
        else{
            setError(true)
        }
    }, [subscription, setSubscription])

  return (
    <div className='container'>
        <EditBannerImg/>
        <EditProfileImage/>
        <Divider3/>
        {/* edit bio section */}
        <div className='padding-20'>
        {loadingBio && <LoadingSpinner btnAction={abort(setLoadingBio)}/> }
            <div className='justify-content-between'>
                <p className='title-secondary-text'>Edit Bio</p>
                <Button1 text={loadingBio ? <LoadingSpinner1/> : 'Save Bio Changes'}
                action={loadingBio ? null : handleUpdateBio}
                />
            </div>
            <ResizingTextArea 
                placeholder={'edit bio'} 
                name='bio' 
                value={bio ? bio : null}
                onChange={(e)=>{setBio(e.target.value)}} 
                wrapperClass={'edit-bio-wrapper temp'}
            />
        </div>
        {/* end edit bio section */}
            <Divider3/>
        {/* edit basic info section*/}

        <div className='padding-20'>
            <div className='justify-content-between'>
                <p className='title-secondary-text'>Edit Basics</p>
                <Button1 
                text= {loadingBasics ? <LoadingSpinner1/> : 'Save Basic Changes'}
                 action={loadingBasics ? null : handleUpdateProfileBasics}/>
            </div>
            <EditField label='First Name' id='firstName' value={firstName} 
            onChange={(e)=> {setFirstName(() => e.target.value)}} 
            />
            <EditField label='Last Name' id='lastName'  value={lastName} 
            onChange={(e)=> {setLastName(() => e.target.value)}} 
            />
            <EditField label='Email' id='email' value={email}
            onChange={(e)=> {setEmail(() => e.target.value)}} type='email'
            />
            <EditField label='Phone' id='phone' type='number' />
        </div>

        {UserProfile.is_instructor && <>
            <Divider3/>
            <div className='padding-30'>
            <div className='justify-content-between'>
                <p className='title-secondary-text'>Edit Subscription Price</p>
                <Button1 text={loadingSubscription ? <LoadingSpinner1/> :'Save Subscription'}
                action={loadingSubscription ? null : handleUpdateSubscriptionPrice}
                />
            </div>
                <CurrencyInput
                id="subscriptionprice"
                name="subscriptionprice"
                placeholder="Enter a price"
                decimalsLimit={2}
                defaultValue={UserProfile.subscription_units ? UserProfile.subscription_units / 100 : 0}
                maxLength={5}
                onValueChange={(value, name) => setPriceUnits(value, name)}
                prefix={'$'}
                className={'price-input'}
                />
            </div>
        </>}
    </div>
  )
}

export default EditProfileBasicsv2