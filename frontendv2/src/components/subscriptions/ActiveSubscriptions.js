import React, {useRef} from 'react'
import SubscriptionItem from './SubscriptionItem'

const ActiveSubscriptions = ({subscriptions, handlePaginateSubscriptions}) => {
  const observer = useRef()

  const handleTrackPosition = element => {
    if(!subscriptions.next) return
    if(observer.current) {observer.current.disconnect()}
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        handlePaginateSubscriptions()
      }
    })
    if(element) {observer.current.observe(element)}
  }
  return (
    <div>
        {
            subscriptions.results.map((sub, index) => {
                if(sub.is_active){return <SubscriptionItem key={index} 
                                                    subscription={sub}/>}
                else {return null}
            })
        }
        {subscriptions.next &&
          <div ref={handleTrackPosition}> </div>
        }
    </div>
  )
}

export default ActiveSubscriptions