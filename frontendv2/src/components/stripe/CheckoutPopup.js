import React, {useState, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import { useHistory } from 'react-router-dom'
import CustomFetch from '../../utils/CustomFetch'
import { checkoutUrls} from '../../utils/BaseInfo'
import { CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import LoadingSpinner from '../general/LoadingSpinner'
import SuccessPopup from '../general/SuccessPopup'
import DevBtn from '../Developers/DevBtn'
import DevCheckoutPop from '../Developers/DevCheckoutPop'

import '../../css/checkout.css'
import '../../css/general.css'

const CheckoutPopup = ({onComplete, onClose, amount, type, 
                                    lookupKey}) => {
    const history = useHistory() 
    
    const {User, handleUpdateUserProfile} = useContext(AuthContext)
    if(!User){history.push('/signup')}

    //for developers only
    const [toggleDev, setToggleDev] = useState(true)
    const handleToggleDev = () => {setToggleDev(!toggleDev)}
    
    const number = amount / 100
    const str_amount = `$${number}`

    const stripe = useStripe()
    const elements = useElements()

    
    const {purchaseSubscription, 
        purchasePost, confirmPurchasePost} = checkoutUrls

    const [btnDisabled, setBtnDisabled] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [showError, setShowError] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleError = () => {
        setProcessing(false)
        setShowError(true)
    }


    const handlePayment = async () =>{
        setBtnDisabled(true)
        setProcessing(true)
        if(type === 'subscription'){
            subscriptionPurchase()
        }
        if(type === 'post'){
            postPurchase()
        }
        else{
            console.error('not supported')
        }
    }

    const subscriptionPurchase = async () => {
        const fetchConfig = {method: 'POST'}
        const {response, data} = await CustomFetch(`${purchaseSubscription.url}/${lookupKey}`, fetchConfig)

        if(response.status === 201){
            const {error, paymentIntent} = await stripe.confirmCardPayment(data.client_secret, {
                payment_method:{
                    type: 'card',
                    card: elements.getElement(CardElement),
                    }
                })

            if(!error && paymentIntent.status === 'succeeded'){
                await handleUpdateUserProfile()
                onComplete()
            }
            else{
                handleError()
            }
        }
        handleError()
    }

    const postPurchase = async () => {
        const fetchConfig = {method:'POST'}
        const {response, data} = await CustomFetch(`${purchasePost.url}/${lookupKey}`, fetchConfig)
        if(response.status === 201){

            const {error, paymentIntent} = await stripe.confirmCardPayment(data.client_secret, {
                payment_method:{
                    type: 'card',
                    card: elements.getElement(CardElement),
                    }
                })
                console.log(paymentIntent)
                if(!error && paymentIntent.status === 'succeeded'){
                    const fetchConfig = {method:'PUT', 
                    body:JSON.stringify({payment_intentId:paymentIntent.id})}
                    const {response} = await CustomFetch(`${confirmPurchasePost.url}/${lookupKey}`, fetchConfig)
                    if (response.status === 201){
                        setProcessing(false)
                        onComplete(lookupKey)
                    }
                    else{
                        handleError()
                    }
                }
                else{
                    handleError()
                }
            }
            handleError()
        }




    

  return (
    <div className='popup-content-container'>
        {/* this section is for developer demo popups only */}
        {User.username === 'developer' ? 
            <>
                <div className='w-100 justify-content-between flex-nowrap'>
                    <div className='w-40'>
                        <DevBtn action={handleToggleDev}/>
                    </div>
                    <div className='w-40 justify-content-end'>
                        <button className='exit-btn' onClick={onClose}>
                            <h2 className='no-space text-secondary-color'>X</h2>
                        </button>
                    </div>
                </div>
            </>
        :
            <>
                <div className='no-space w-100 justify-content-end'>
                    <button className='exit-btn' onClick={onClose}>
                        <h2 className='no-space text-secondary-color'>X</h2>
                    </button>
                </div>
            </>
        }

        {toggleDev &&
            <DevCheckoutPop closePopup={handleToggleDev}/>
        }

        <div className='justify-content-center w-100'>
            <p className='title-primary-text'>Purchase This {type}?</p>
        </div>
        <div className='justify-content-center w-100'>
            <h2 className='title-primary-text'>{str_amount}</h2>
        </div>
        {!showError && !success &&
            <>
            <div className='card-input-wrapper'>
                <CardElement />
            </div>
            <div className='justify-content-center margin-20 w-100'>
                { processing ? <LoadingSpinner/> :
                    <button className={'pay-btn'} onClick={handlePayment} disabled={!stripe || !elements || btnDisabled}>Pay</button>
                }
            </div>
            </>
        }
        {showError &&
        <>
            <div className='justify-content-center'>
                <h2>An Error has occurred, please try again later</h2>
            </div>
        </>
        }
        {success &&
            <SuccessPopup/>
        }

    </div>
  )
}

export default CheckoutPopup