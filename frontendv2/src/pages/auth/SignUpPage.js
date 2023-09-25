import React, {useState} from 'react'
import {createUserUrl} from '../../utils/BaseInfo'
import { useHistory } from 'react-router-dom'
import Error3 from '../../components/errors-success/Error3'
import Button6 from '../../components/buttons-inputs/Button6'
import Input1 from '../../components/buttons-inputs/Input1'
import LoadingSpinnerForm from '../../components/loaders/LoadingSpinnerForm'
import formInputChecker from '../../utils/FormInputChecker'
import '../../css/login-signup.css'
import '../../css/general.css'

const SignUpForm = () => {
    const [error, setError] = useState(() => null)
    const [loading, setLoading] = useState(() => false)
    const history = useHistory()

    const handleSignup = async (e) =>{
        e.preventDefault()

        setError(null)

        const checkError = formInputChecker(e, setError)
        if(checkError) return

        const payload = {
            'username':e.target.username.value,
            'password':e.target.password.value,
            'email':e.target.email.value
        }
        const confirmPassword = e.target.confirmpassword.value

        if(payload['password'] !== confirmPassword){
            setError({message:"Passwords do not match"})
            return 
        } 

      setLoading(() => true)
      const response = await fetch(createUserUrl,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(payload)
        })

      if(response.status === 201){
        history.push('/login')
        return
      }
    
      setError('Unable to create account')
    
    }


  return (
      <form className='login-container temp margin-30' onSubmit={handleSignup} id='signup-form'>
        <div className='w-100 justify-content-center'>
          <h2 className='padding-0 margin-0 text-white'>Signup</h2>
        </div>
          {error && error.message &&
            <Error3 errorMessage={error.message}/>
          }
          {!loading && <>
            <Input1 name='username' placeholder='Username' type='text' error={error}/>
            <Input1 name='password' placeholder='Password' type='password'error={error}/>
            <Input1 name='confirmpassword' placeholder='Confirm Password' type='password' error={error}/>
            <Input1 name='email' placeholder='Email' type='email' error={error}/>
            <div className='w-100 justify-content-space-around'>
              <Button6 text='Login' action={() => {history.push('/login')}} background={'theme-secondary'} color={'text-white'}/>
              <Button6 text='Sign Up' form={'signup-form'} color={'text-secondary'}/>
            </div>
          </>
          }
      
        {loading &&
          <LoadingSpinnerForm/>
        }
      </form>
  )
}

export default SignUpForm