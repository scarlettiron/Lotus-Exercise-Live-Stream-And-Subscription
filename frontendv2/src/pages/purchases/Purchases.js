import React, {useState, useRef} from 'react'
import Button5 from '../../components/general/Button5'
import ViewSubscriptions from '../../components/subscriptions/ViewSubscriptions'
import ViewPurchasedPosts from '../../components/purchases/ViewPurchasedPosts'
import GeneralHeader from '../../components/general/headers/GeneralHeader'
import '../../css/general.css'

const Purchases = () => {
    const initial = useRef(true)
    const [viewPosts, setViewPosts] = useState(() => false)
    const [viewSubscriptions, setViewSubscriptions] = useState(() => false)

    const handleSetViewSubscriptions = () => {
        if(initial.current){
            setViewSubscriptions(() => true)
            initial.current = false
            return
        }
        setViewPosts(() => !viewPosts)
        setViewSubscriptions(() => !viewSubscriptions)
    }

    const handleSetViewPosts = () => {
        if(initial.current){
            setViewPosts(() => true)
            initial.current = false
            return
        }
        setViewSubscriptions(() => !viewSubscriptions)
        setViewPosts(() => !viewPosts)
    }


  return (
    <div className='container'>
        <GeneralHeader text='Purchases' />
        <div className='w-100 justify-content-space-around'>
            <Button5 text='Posts' btnClass={viewPosts ? 'active' : null} action={handleSetViewPosts}/>
            <Button5 text='Subscriptions' btnClass={viewSubscriptions ? 'active' : null} action={handleSetViewSubscriptions}/>
        </div>
        <div className='container'>
            {viewSubscriptions && !viewPosts &&
                <ViewSubscriptions/>
            }

            {viewPosts && !viewSubscriptions &&
                <ViewPurchasedPosts/>
            }

        </div>
    </div>     
  )
}

export default Purchases