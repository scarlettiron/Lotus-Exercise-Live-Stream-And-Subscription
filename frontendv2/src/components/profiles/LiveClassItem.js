import React, {useState} from 'react'
import '../../css/general.css'
import '../../css/profile.css'
import {ReactComponent as ArrowDown} from '../../assets/chevron-down-circle.svg'
import {ReactComponent as ArrowUp} from '../../assets/chevron-up-circle.svg'
import Button2 from '../general/Button2'
import Button1 from '../general/Button1'
import CheckoutWrapper from '../stripe/CheckoutWrapper'


const getLength = (duration) => {
    if(duration >= 60){
        let time = (duration / 60).toFixed(2)
        if(time === 1){
            return `${time} hour`
        }
        else{return `${time} hours`}

    }
    else{return `${duration} minutes`}
}


const LiveClassItem = ({item}) => {
    const [dropDown, setDropDown] = useState(false)
    const toggle = () => {setDropDown(!dropDown)}

    const [classCheckoutPopup, setClassCheckoutPopup] = useState(false)

    const toggleCheckout = () => {setClassCheckoutPopup(!classCheckoutPopup)}

  return (
    <div className='session-item-wrapper'>
        <div className='session-item-drop'>
        {dropDown ? (<p className='text-paragraph'>{item.title}</p>) : (<p className='text-paragraph'>{item.title.substring(0, 50)}</p>)}
        <Button2 action={toggle} text={dropDown ? <ArrowUp/> : <ArrowDown/> } />
        </div>
        {dropDown && 
        <>
        <div className='session-info-wrapper'>
            {classCheckoutPopup &&
                <CheckoutWrapper 
                type='class'
                lookupKey={item.pk}
                onClose={toggleCheckout}
                amount = {item.price_units}
                />
            }
            <div className='session-info-column'>
                <p className='title-secondary-text'>Duration</p>
                <p className='text-paragraph'>{getLength(item.duration)}</p>
            </div>
            <div className='session-info-column'>
                <p className='title-secondary-text'>Price</p>
                <p className='text-paragraph'>${item.price}</p>
            </div>
            <div className='session-info-column'>
                <Button1 text={"Book Now"} action={toggleCheckout}/>
            </div>
        </div>
        <div className='session-info-wrapper'>
            <p className='margin-30 text-paragraph text-indent w-100'>{item.description}</p>
        </div> 
        </> }

    </div>
  )
}

export default LiveClassItem