import React, {useEffect, useState, useCallback} from 'react'
import CustomFetch from '../../utils/CustomFetch'
import LoadingSpinner from '../../components/general/LoadingSpinner'
import { subscriptionUrls } from '../../utils/BaseInfo'
import ActiveSubscriptions from '../../components/subscriptions/ActiveSubscriptions'
import InactiveSubscriptins from '../../components/subscriptions/InactiveSubscriptions'
import Button5 from '../../components/general/Button5'

const ViewSubscriptions = () => {
    const [loading, setLoading] = useState(() => true)
    const [subscriptions, setSubscriptions] = useState(() => null)
    const [viewActive, setViewActive] = useState(() => true) 

    const {subscriptionsList} = subscriptionUrls

    const getSubscriptions = async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(subscriptionsList.url, fetchConfig)
        if(response.status === 200) {
            setSubscriptions(() => data)
            setLoading(() => false)
        }
    }

    const handlePaginateSubscriptions = useCallback(async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(subscriptionsList.next, fetchConfig)
        if(response.status === 200){
            setSubscriptions(oldArray => ({
                ...oldArray, results:[...oldArray.results, ...data.results], 
                next:data.next, previous:data.previous}))
        }
    }, [setSubscriptions])

    useEffect(()=>{
        getSubscriptions()
    }, [])
  return (
    <div className='w-100'>
        {loading && <LoadingSpinner/>}

        {!loading &&
            <>
                <div className='w-100 margin-20 justify-content-space-around'>
                    <Button5 text='Active' action={() => setViewActive(() => true)} btnClass={viewActive ? 'active' : null}/>
                    <Button5 text='Inactive' action={() => setViewActive(() => false)} btnClass={!viewActive ? 'active' : null}/>

                </div>
            </>
                        
        }

        {subscriptions && subscriptions.count > 0 && viewActive &&
            <ActiveSubscriptions 
            subscriptions={subscriptions}
            handlePaginateSubscriptions={handlePaginateSubscriptions}
            />
        }

        {subscriptions && subscriptions.count > 0 && !viewActive &&
            <InactiveSubscriptins 
            subscriptions={subscriptions} 
            handlePaginateSubscriptions={handlePaginateSubscriptions}
            />
        }
    </div>
  )
}

export default ViewSubscriptions