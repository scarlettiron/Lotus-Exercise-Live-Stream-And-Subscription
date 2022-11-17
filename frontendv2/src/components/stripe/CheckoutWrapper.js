import React from 'react'
import CheckoutPopup from './CheckoutPopup'
import ClassCheckoutPopup from './ClassCheckoutPopup'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const CheckoutWrapper = ({onComplete, onClose, amount, type, 
                          lookupKey}) => {
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_SECRET)
  return (
    <div className='purchase-popup-container'>
        <Elements stripe={stripePromise}>
          {type === 'class' ? 
            <ClassCheckoutPopup
            onComplete={onComplete} 
            onClose={onClose}
            amount={amount}
            type={type}
            lookupKey={lookupKey}
            />
            :
            <CheckoutPopup
                onComplete={onComplete} 
                onClose={onClose}
                amount={amount}
                type={type}
                lookupKey={lookupKey}
            />
            }
        </Elements>
    </div>
  )
}

export default CheckoutWrapper