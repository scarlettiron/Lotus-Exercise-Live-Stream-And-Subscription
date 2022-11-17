import React, {useContext, useState} from 'react'
import AuthContext from '../../context/AuthContext'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import Error3 from '../../components/errors-success/Error3'
import SideBar from '../../components/navbars/SideBar'
import Button6 from '../../components/buttons-inputs/Button6'
import LoadingSpinnerForm from '../../components/loaders/LoadingSpinnerForm'
import '../../css/login-signup.css'
import '../../css/general.css'

const ResetPasswordConfirm = () => {
    const {confirmPasswordReset} = useContext(AuthContext)
    const {uid, token} = useParams()
    const [error, setError] = useState(() => null)
    const [loading, setLoading] = useState(() => false)
    

    const history = useHistory()

    const handleConfirmPasswordReset = async (e) => {
        e.preventDefault()
        setError(() => null)
        const password = e.target.password.value
        const verifyPassword = e.target.verifypassword.value

        if(!password | !verifyPassword){
            setError('Enter Password')
            return
        }
        if(password !== verifyPassword){
            setError('Passwords must match')
            return
        }
        setLoading(() => true)
        const response = confirmPasswordReset(uid, token, password, verifyPassword)

        if(response.status === 204){
          history.push('/login')
          return
        }

        setError(() => 'Try again later')
        setLoading(() => false)
    }

  return (
    <div className='main-container'>
      <div className='main-wrapper'>
      <SideBar/>
      <div className='display-inline margin-0 padding-0'>
        
        <form className='login-container temp margin-30' onSubmit={handleConfirmPasswordReset} id='confirm-reset-password-form'>
          <div className='w-100 justify-content-center'>
            <h2 className='padding-0 margin-0 text-white'>Reset Password</h2>
          </div>
            {error &&
              <Error3 errorMessage={error}/>
            }
            {!loading && <>
                <input className='login-input w-100'  name='password' placeholder='Password' type='password'/>
                <input className='login-input w-100'  name='verifypassword' placeholder='Re-type Password' type='password'/>
                <div className='w-100 justify-content-space-around'>
                  <Button6 text='Cancel' action={() => {history.goback()}} background={'theme-secondary'} color={'text-white'}/>
                  <Button6 text='Reset Password' form={'confirm-reset-password-form'} color={'text-secondary'}/>
                </div>
              </>
            }
            {loading &&
              <LoadingSpinnerForm/>
            }
        </form>
        
      </div>
      </div>
    </div>
  )
}

export default ResetPasswordConfirm