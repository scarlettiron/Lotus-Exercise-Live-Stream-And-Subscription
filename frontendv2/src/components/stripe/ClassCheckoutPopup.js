import React, {useState, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import { useHistory } from 'react-router-dom'
import CustomFetch from '../../utils/CustomFetch'
import {convertLocalToDbTime, addAndConvertToDbTime} from '../../utils/DateFunctions'
import { checkoutUrls} from '../../utils/BaseInfo'
import { CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import LoadingSpinner from '../general/LoadingSpinner'
import SuccessPopup from '../general/SuccessPopup'
import DevBtn from '../Developers/DevBtn'
import DevCheckoutPop from '../Developers/DevCheckoutPop'
import Calendar from 'react-calendar'
import TimeSelect from '../buttons-inputs/TimeSelect'
import Button1 from '../general/Button1'

import '../../css/checkout.css'
import '../../css/general.css'
import 'react-calendar/dist/Calendar.css';


const ClassCheckoutPopup = ({onComplete, onClose, amount, lookupKey}) => {
  const history = useHistory() 
    
  const {User} = useContext(AuthContext)
  if(!User){history.push('/signup')}

  //for developers only
  const [toggleDev, setToggleDev] = useState(true)
  const handleToggleDev = () => {setToggleDev(!toggleDev)}
  
  const number = amount / 100
  const str_amount = `$${number}`

  const stripe = useStripe()
  const elements = useElements()

  const {purchaseClass} = checkoutUrls

const [calendar, setCalendar] = useState(() => false)
const [date, setDate] = useState(() => true)
const [time, setTime] = useState(() => false)
const [pay, setPay] = useState(() => false)
const [processing, setProcessing] = useState( () => false)
const [showError, setShowError] = useState(() => false)
const [success, setSuccess] = useState(() => false)


  const classPurchase = async () => {
    setProcessing(true)
    const year = date.date.getFullYear()
    const month = date.date.getMonth()
    const day = date.date.getDate()

    const start_time = convertLocalToDbTime(year, month, 
    day, date.hour, date.minutes)

    const end_time = addAndConvertToDbTime(start_time, 70)

    const fetchConfig = {method:'POST', 
    body:JSON.stringify({start_time:start_time, end_time:end_time})}
  
    const {response, data} = await CustomFetch(`${purchaseClass.url}/${lookupKey}`, fetchConfig)
    if(response.status === 201){
        const {error, paymentIntent} = await stripe.confirmCardPayment(
            data.client_secret, {
                payment_method:{
                    type: 'card',
                    card: elements.getElement(CardElement),
                }
            }
        )
        setProcessing(false)
        if(paymentIntent.status === 'succeeded'){
          setSuccess(true)
          return
        }
        setShowError(true)
    }
  }

    const handleCalendarSelect = (e) => {
      setDate({date:e})
    }

    const handleTimeSelect = (e) => {
      e.preventDefault()
      let hour = e.target.class_am_pm.value === 'am' ? e.target.class_hour.value : String(parseInt(e.target.class_hour.value) + 12)
      if(hour >= 24){hour = 0}

      let minutes = e.target.class_minutes.value === '00' ? '0' : e.target.class_minutes.value

      hour = parseInt(hour)
      minutes = parseInt(minutes)

      setDate((oldArray) => ({hour:hour, minutes:minutes, ...oldArray}))
    
      setCalendar(false)
      setTime(false)
      
      if(!date.date){
        setShowError("Select a date")
        return
      }
      if(!date.hour | !date.minutes){
        setShowError("Select A time")
        return
      }

      setPay(true)
    }

    const handleMenuSelect = () => {
      setCalendar(!calendar)
      setTime(!time)
    }


  return (
    <div className='class-checkout-popup'>
      {!pay &&
      <div className='justify-content-end padding-20 w-90'>
        <button className='exit-btn' onClick={onClose}>
            <h2 className='no-space text-secondary-color'>X</h2>
        </button>
      </div>
      }
      {calendar &&
        <>
        <Calendar
          minDate={new Date()}
          //maxDate={}
          onClickDay={handleCalendarSelect}
          className={'h-100'}
          />
          <div className='w-100 justify-content-center'>
            <Button1 text={'Next'} action={() => handleMenuSelect()}/>
          </div>
        </>
        }
        {
          time &&
            <div className='w-100 h-100 justify-content-center flex-wrap'>
              {showError &&
                <div className='justify-content-center'>
                    <h2>{showError}</h2>
                </div>
              }
              <form onSubmit={handleTimeSelect} id='timeselect-form'>
                <TimeSelect
                id='class'
                label='When'
                minutes={true}
                />
                </form>
              <div className='w-90 justify-content-space-around'>
                <Button1
                text='Prev'
                action = {() => handleMenuSelect()}
                />
                <Button1 
                text='Next'
                form={'timeselect-form'}
                />
              </div>
            </div>
        }

        {
          pay &&
          <div className='popup-content-container'>
          {/* this section is for developer demo popups only */}
          {User.username === 'ScarlettIron' ? 
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
              <p className='title-primary-text'>Purchase This Class?</p>
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
                      <button className={'pay-btn'} onClick={classPurchase} disabled={!stripe || !elements}>Pay</button>
                  }
              </div>
              </>
          }
          {showError &&
              <div className='justify-content-center'>
                  <h2>{showError}</h2>
              </div>
          }
          {success &&
              <SuccessPopup/>
          }
  
      </div>
        }


    </div>
  )
}

export default ClassCheckoutPopup