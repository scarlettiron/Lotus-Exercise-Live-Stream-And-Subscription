import React, {useState} from 'react'
import {ReactComponent as LockSquare} from '../../assets/shopping-bag.svg'
import CheckoutWrapper from '../stripe/CheckoutWrapper'
import '../../css/general.css'

const PostPay = ({post, handleSetHasPurchased}) => {
  const [postCheckoutPopup, setPostCheckoutPopup] = useState(false)

  const handleDisplayPopup = () => {
    setPostCheckoutPopup(!postCheckoutPopup)
  }


  return (
    <div className='pay-sub-container'>
            <div className='pay-sub-wrapper'>
              {postCheckoutPopup && 
              <CheckoutWrapper
                amount={post.price_units}
                type={'post'}
                lookupKey={post.id}
                onClose={handleDisplayPopup}
                onComplete={handleSetHasPurchased}
              />
              } 
                <div className='pay-sub-btn-wrapper'>
                    <LockSquare viewBox="0 0 490 490" className='postpay-svg'/>
                </div>
                <div className='pay-sub-btn-wrapper'>
                    <h2>Pay to unlock</h2>
                </div>
                <div className='pay-sub-btn-wrapper padding-30'>
                    <button className='width-150 btn-1' onClick={handleDisplayPopup}>{`Pay $${post.price}`}</button>
                </div>
            </div>
    </div>
  )
}

export default PostPay