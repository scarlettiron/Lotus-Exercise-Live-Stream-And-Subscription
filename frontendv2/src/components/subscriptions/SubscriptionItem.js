import React, {useState, useCallback} from 'react'
import CustomFetch from '../../utils/CustomFetch'
import { subscriptionUrls } from '../../utils/BaseInfo'

import ProfilePicBtn from '../general/ProfilePicBtn'
import LinkBtn from '../general/LinkBtn'
import Button1 from '../general/Button1'

import '../../css/search.css'
import '../../css/general.css'
import '../../css/posts.css'

const SubscriptionItem = React.memo(({subscription}) => {
    const [subscribed, setSubscribed] = useState({is_active: subscription.is_active, is_renewed:subscription.is_renewed})

    const handleCancelSubscription = useCallback(async () => {
        const {cancelSubscription} = subscriptionUrls
        const fetchConfig = {method:'PUT'}
        const {response, data} = await CustomFetch(`${cancelSubscription.url}/${subscription.creator.pk}`, 
        fetchConfig)
        if(response.status === 204){
          setSubscribed({is_active: true, is_renewed:false})
        }
    }, [])

  return (
        <div className='search-user-container padding-20'>
            <div className='display-inline'>
            <div className='post-header-pic-username-wrapper'>
                <div className='display-inline'>
                     <ProfilePicBtn user={subscription.creator} btnClass='search-profile-pic-wrapper' /> 
                </div>
                <div className='post-username-wrapper'>
                    <p className='post-username'>@{subscription.creator.username}</p>
                </div>
            </div>
            </div>
            <div className='display-inline w-50'>
                <div className='search-user-split-containers justify-content-end'>
                    <div className='margin-tb-auto'>
                        <LinkBtn link={`/user/${subscription.creator.username}`} text='View Profile' />
                    </div>
                    <div className='margin-tb-auto'>
                        {subscribed && subscription.is_active && subscription.is_renewed ? <Button1 text={'Unsubscribe'} action={handleCancelSubscription}/> 
                        : <LinkBtn text={'Subscribe Again'} link={`/user/${subscription.creator.username}`} />}
                    </div>
                </div>
            </div>
        </div>  
  )
})

export default SubscriptionItem