import React, {useState, useContext, useEffect} from 'react'
import AuthContext from '../../context/AuthContext'
import { useHistory } from 'react-router-dom'
import Error3 from '../../components/errors-success/Error3'
import SideBar from '../../components/navbars/SideBar'
import Button6 from '../../components/buttons-inputs/Button6'
import LoadingSpinnerForm from '../../components/loaders/LoadingSpinnerForm'
import DevBtn from '../../components/Developers/DevBtn'
import DevLoginPopup from '../../components/Developers/DevLoginPopup'
import Input1 from '../../components/buttons-inputs/Input1'
import formInputChecker from '../../utils/FormInputChecker'
import '../../css/login-signup.css'
import '../../css/general.css'

const LoginForm = () => {
  const {loginUser, User} = useContext(AuthContext)
  const [error, setError] = useState(() => null)
  const [loading, setLoading] = useState(() => false)
  const [dev, setDev] = useState(false)


  const toggleDevPopup = () => {
    setDev(!dev)
  }

  const history = useHistory()
 
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(() => null)
    const checkError = formInputChecker(e, setError)
    if(checkError) return

    const username = e.target.username.value
    const password = e.target.password.value

    setLoading(() => true)
    const loginError = await loginUser(username, password)
    if(loginError){
      setLoading(() => false)
      setError({message:loginError})
      return
    }

      history.push(`/user/${username}`)
  }


  useEffect(() => {
    console.log('useffct')
    if(User){
      history.push('/feed')
    }
  }, [])

  return (
    <div className='main-container'>
      <div className='main-wrapper'>
      <SideBar/>
      <div className='display-inline margin-0 padding-0'>
        <form className='login-container margin-30' onSubmit={handleLogin} id='login-form'>
        {dev &&
              <DevLoginPopup closePopup={toggleDevPopup}/>
        }
          <div className='w-100 justify-content-center'>
            <h2 className='padding-0 margin-0 text-white'>Login</h2>
          </div>
            {error && error.message &&
              <Error3 errorMessage={error.message}/>
            }
            {!loading &&
              <>
                <Input1 name='username' placeholder='Username' type='text' error={error}/>
                <Input1 name='password' placeholder='Password' type='password' error={error}/>
                <div className='w-100 justify-content-space-around'>
                  <Button6 text='Sign up' action={() => {history.push('/signup')}} background={'theme-secondary'} color={'text-white'}/>
                  <DevBtn action={toggleDevPopup}/>
                  <Button6 text='Login' form={'login-form'} color={'text-secondary'}/>
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

export default LoginForm