import React, {useContext, useState} from 'react'
import { useHistory } from 'react-router-dom'
import '../../css/profile.css'
import Button1 from '../general/Button1'
import CheckoutWrapper from '../stripe/CheckoutWrapper'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import {followingListCreateUrl, unfollowUserUrl, subscriptionUrls} from '../../utils/BaseInfo'


const ProfileBtns = React.memo(({user}) => {
  let history = useHistory()

  const handleCreatePostRedirect = () => {history.push('/new-post/create/')}
  const handleEditProfileRedirect = () => {history.push('/profile/edit')}

  const {User} = useContext(AuthContext)
  const {cancelSubscription} = subscriptionUrls

  const [following, setFollowing] = useState(User.username !== user.username && user.following ? true : false)
  const [subscribed, setSubscribed] = useState(user.subscribed ? true : false)
  const [purchasePopup, setPurchasePopup] = useState(() => false)
 


  const handleFollow = async () => {
    const fetchConfig = {method:'POST', body:JSON.stringify({creator:user.id, follower:User.user_id})}

    const {response, data} = await CustomFetch(followingListCreateUrl, fetchConfig) 

    if(response.status === 201){
      setFollowing(() => true)
    }
  } 

  const handleUnfollow = async () => {
    const fetchConfig = {method:'DELETE'}
    const {response, data} = await CustomFetch(`${unfollowUserUrl}${user.id}/`, fetchConfig)
    if(response.status === 202){
      setFollowing(() => false)
    }
  }

  /// functions to handle user attempting to subscribe to creator ///
  const handleSubscribe = () => {
    setPurchasePopup(() => true)
  }

  const handleCheckoutSuccess = () =>{
    setPurchasePopup(() => false)
    setSubscribed(() => true)
  }

  const handleOnClose = () => {
    setPurchasePopup(() => false)
  }
  /// end ///

  const handleUnsubscribe = async () => {
    const fetchConfig = {method:'PUT'}
    const {response, data} = await CustomFetch(`${cancelSubscription.url}/${user.id}`, fetchConfig)
    if(response.status === 204){
      setSubscribed(() => false)
    }
  }


  return (
    <div className='profile-btns-wrapper'>
        {user.username === User.username ? <> <Button1 action={handleCreatePostRedirect} text={'Create Post'}/>
          <Button1 action={handleEditProfileRedirect} text={'Edit Profile'} />
        </> :
        
        <>
        <Button1 action={()=>{
          user.existing_thread ? history.push(`/chat/${user.existing_thread}`)
          : history.push(`/chat/new-${user.id}`)
          }} 
        text={'Message'} 
        />
        
        {following ? <Button1 action={handleUnfollow} text={'Unfollow'}/>
        : <Button1 action={handleFollow} text={'Follow'} />}

        {subscribed ? 
          <Button1 action={handleUnsubscribe} text={'Unsubscribe'} /> 
          : 
          user?.subscription_units > 0 && 
            <>
              <Button1 action={handleSubscribe} text={`Subscribe $${user?.subscription}`}/>
            </>
        }
      </>
  }
      { purchasePopup &&
        <CheckoutWrapper
        onComplete={handleCheckoutSuccess} 
        onClose={handleOnClose}
        amount={user.subscription_units}
        type='subscription'
        lookupKey={user.id}
        />
      }
    </div>
  )
})

export default ProfileBtns