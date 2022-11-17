import React, {useContext, useState} from 'react'
import AuthContext from '../../context/AuthContext'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import Error3 from '../../components/errors-success/Error3'
import Input1 from '../../components/buttons-inputs/Input1'
import SideBar from '../../components/navbars/SideBar'
import Button6 from '../../components/buttons-inputs/Button6'
import '../../css/login-signup.css'
import '../../css/general.css'
import LoadingSpinnerForm from '../../components/loaders/LoadingSpinnerForm'

const ResetPassword = () => {
  const {resetPassword} = useContext(AuthContext)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  

  const history = useHistory()

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault()
    setError(null)

    const email = e.target.email.value

    if(!email){
      setError('Email required')
      return
    }

    setLoading(true)
    const response = await resetPassword(email)
    setLoading(false)
    if(response.status === 204){
      setLoading(false)
      setStatus("Check your email!")
      return
    }
    setStatus("Try again later.")
  }

  return (
    <div className='main-container'>
      <div className='main-wrapper'>
      <SideBar/>
      <div className='display-inline margin-0 padding-0'>
        
        <form className='login-container temp margin-30' onSubmit={handlePasswordResetRequest} id='reset-password-form'>
          <div className='w-100 justify-content-center'>
            <h2 className='padding-0 margin-0 text-white'>Request Password Reset</h2>
          </div>
            {error &&
              <Error3 errorMessage={error}/>
            }
            {!loading && !status && <>
              <Input1 name='email' placeholder='Email' type='email'/>
              <div className='w-100 justify-content-space-around'>
                <Button6 text='Cancel' action={() => {history.goback()}} background={'theme-secondary'} color={'text-white'}/>
                <Button6 text='Reset Password' form={'reset-password-form'} color={'text-secondary'}/>
              </div>
              </>
            }
            {loading &&
              <LoadingSpinnerForm/>
            }
            {status &&
              <div className='w-100 justify-content-center'>
                <h3 className='text-white'>{status}</h3>
              </div>
            }
        </form>
        
      </div>
      </div>
    </div>
  )
}

export default ResetPassword