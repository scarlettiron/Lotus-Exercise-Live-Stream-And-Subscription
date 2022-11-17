import React, {useContext, useState, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import { convertHoursToUtc } from '../../utils/DateFunctions'
import { classUrls } from '../../utils/BaseInfo'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import {ValidateForm, validateFormCheckboxes} from '../../utils/FormValidations'
import LoadingSpinner from '../../components/general/LoadingSpinner'
import SuccessPopup from '../../components/general/SuccessPopup'
import ErrorBanner from  '../../components/general/errors/ErrorBanner'
import SideBar from '../../components/navbars/SideBar'
import ResizingTextArea from '../../components/general/ResizingTextArea'
import ResponsiveBtn from '../../components/general/ResponsiveBtn'
import CurrencyInput from 'react-currency-input-field'
import TimeSelect from '../../components/buttons-inputs/TimeSelect'
import '../../css/general.css'
import '../../css/profile.css'

const CreateClass = () => {

    const {User} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const formRef = useRef()
    const history = useHistory()
    const {listCreateLiveClassUrl} = classUrls

    const formDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 
    'saturday', 'sunday']

    const controller = new AbortController()
    const signal = controller.signal
    
    const handleCancel = () => {history.goBack()}

    const abort = () => {
        controller.abort()
        setLoading(false)
    }

    const handleCreateClass = async (e) =>{
        e.preventDefault()
        const val = ValidateForm(e, formDays)
        if(val.error){
            setError(()=>val.error) 
            return}
        const checkBoxVal = validateFormCheckboxes(e, 1)
        if(!checkBoxVal){
            setError(()=>'Choose atleast one day')
            return
        }
        setLoading(true)
        const fromAmOrPm = e.target.from_time_am_pm.value === 'am' 
        ? {hour:e.target.from_time_hour.value} 
        : {hour:e.target.from_time_hour.value + 12}

        const toAmOrPm = e.target.to_time_am_pm.value === 'am' 
        ? {hour:e.target.to_time_hour.value} 
        : {hour:e.target.to_time_hour.value + 12}

        const from_time = convertHoursToUtc(fromAmOrPm)
        const to_time = convertHoursToUtc(toAmOrPm)

        const classLength = parseInt(e.target.hours.value) * 60 + parseInt(e.target.minutes.value)
        const classPrice = e.target.classprice.value.split('$')[1] * 100


        const payload = {
            user:User.user_id,
            from_time:from_time, 
            to_time:to_time, 
            title:e.target.title.value,
            description:e.target.description.value,
            duration:classLength,
            price_units:classPrice,
            days_available:{monday:e.target.monday.checked,
                tuesday:e.target.tuesday.checked,
                wednesday:e.target.wednesday.checked,
                thursday:e.target.thursday.checked,
                friday:e.target.friday.checked,
                saturday:e.target.saturday.checked,
                sunday:e.target.sunday.checked
            }

        }

        const fetchConfig = {method:'POST', signal:signal, body:JSON.stringify(payload)}
        console.log(listCreateLiveClassUrl)
        const {response, data} = await CustomFetch(`${listCreateLiveClassUrl.url}${User.username}/`, fetchConfig)
        if(response.status === 201){
            setLoading(false)
            setSuccess(true)
        }
        else{
            setError(() => 'Error: Please try later')
        }
    }

    const days = () =>{
        return formDays.map((day) => {return <> <label className='text-paragraph' for={day}>{day}</label>
        <input type='checkbox' name={day} id={day}/></>})
    }

  return (
    <div className='main-container'>
        <div className='main-wrapper'>
            <SideBar/>
            <div className='display-inline'>
                <div className='container'>
                {loading && <LoadingSpinner btnAction={abort}/>}
                {success && <SuccessPopup/>}
                    <div className='justify-content-center w-100 padding-20'>
                        <h1 className='title-primary-text'>CREATE CLASS</h1>
                    </div>
                    <div className='justify-content-between w-100'>
                        <ResponsiveBtn 
                        btnWrapper={'display-inline margin-20'} 
                        text={'Cancel'} 
                        btnClass={'theme-secondary'} 
                        action={handleCancel}
                        />
                        
                        <ResponsiveBtn 
                        btnWrapper={'display-inline margin-20'} 
                        text={'Create'} 
                        btnClass={'theme-primary'}
                        for={'create-class-form'}
                        type='submit'
                        form='create-class-form'
                        />
                    </div>
                    {error && <ErrorBanner error={error}/>}
                    <form ref={formRef} id='create-class-form' name='create-class-form' className='w-100' onSubmit={(e)=>handleCreateClass(e)} method='POST'> 
                        <ResizingTextArea 
                        wrapperClass={'post-input-wrapper temp'} 
                        name='Title'
                        id='title' 
                        placeholder='Add a title (100 characters)' 
                        max_length={100}
                        />

                        <ResizingTextArea 
                        wrapperClass={'post-input-wrapper temp'} 
                        name='Description'
                        placeholder='Add a description (2000 characters)'
                        id='description'
                        max_length={2000}
                        />

                        <div className='justify-content-center margin-20'>
                            <p className='text-paragraph'>Select between what hours the class will be available</p>
                        </div>
                        <div className='justify-content-center'>
                            <div className='display-inline w-50'>
                                <TimeSelect
                                id='from_time'
                                label='From'
                                />
                            </div>
                            <div className='display-inline w-50 margin-20'>
                            <TimeSelect
                                id='to_time'
                                label='To'
                                />
                            </div>
                        </div>
                        <div className='w-100 justify-content-center margin-20'>
                            <p className='text-paragraph'> Choose the days this class is available</p>
                        </div>
                        <div className='multiple-choice'>
                            {days()}
                        </div>
                        <div className='w-100 justify-content-center margin-20'>
                            <p className='text-paragraph'> How long will this class be?</p>
                        </div>
                        <div className='w-100 justify-content-center flex-wrap margin-20'>
                            <div className='margin-20'>
                                <div className='display-inline'>
                                    <p className='text-paragraph'>Hours</p>
                                </div>
                                <input type='number' id='hours' name='hours'  className='price-input'/>
                            </div>
                            <div className='margin-20'>
                                <div className='display-inline'>
                                    <p className='text-paragraph'>Minutes</p>
                                </div>
                                <input type='number' id='minutes' name='minutes'  className='price-input'/>
                            </div>
                        </div>
                        <div className='post-price-wrapper margin-20'>
                            <div className='display-inline'>
                                <p className='text-paragraph'>Add a price</p>
                            </div>
                            <div className='display-inline'>
                                <CurrencyInput
                                id="classprice"
                                name="Class price"
                                placeholder="Enter a price (optional)"
                                decimalsLimit={2}
                                defaultValue={0}
                                maxLength={5}
                                onValueChange={(value, name)=>{}}
                                prefix={'$'}
                                className={'price-input'}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateClass