import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import '../css/profile.css'

const Header = () => {
  let {User} = useContext(AuthContext)
  return (
    <div>
  
      <h1 className='text-secondary'>{User?.username}</h1>

        <Link to="/">Home</Link>
        <span>   |   </span>
        <Link to="/login">Login</Link>
        <span>   |   </span>
        <Link to="/signup">Signup</Link>
    </div>
  )
}

export default Header