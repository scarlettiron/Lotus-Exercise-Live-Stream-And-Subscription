import {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import dayjs from 'dayjs'
import GetCookie from './GetCookie'
import {loginRefreshUrl} from './BaseInfo'
import jwtDecode from 'jwt-decode'


const CustomFetch = () => {

    const {AuthTokens, setAuthTokens, setUser, logoutUser} = useContext(AuthContext)
    const csrfToken = GetCookie('csrftoken')


    const originalRequest = async (url, config) => {
        const response = await fetch(url, config)
        const data = response.json()
        return {response, data}
    } 

    const refreshToken = async (AuthTokens) => {
        const response = await fetch(loginRefreshUrl, {
            method:'POST',
            headers:{
                'X-CSRFToken':csrfToken
            },
            body:JSON.stringify({'refresh':AuthTokens.refresh})
        })
        if(response.status === 200){
            const data = await response.json()
            setAuthTokens(data)
            localStorage.setItem('authTokens', data)
            const user = jwtDecode(data.access)
            setUser(user)
            localStorage.setItem('user', user)
            return data
        }
        else{
            logoutUser()
        }
    }

    const fetchData = async (url, config={}) => {
        const exp = jwtDecode(AuthTokens.access).exp
        const isExpired = dayjs.unix(exp).diff(dayjs()) < 1
        if(isExpired){
            AuthTokens = refreshToken(AuthTokens)
        }

        if(!config['headers']){
            config['headers'] = {}
        }

        config['headers']['X-CSRFTokens'] = csrfToken
        config['headers']['Authorization'] = 'Bearer ' + AuthTokens.refresh

        if(!config['Content-Type']){
            config['Content-Type'] = 'application/json'
        }

        let {response, data} = await originalRequest(url, config)
        return {response, data}
    }

    return fetchData

}

export default CustomFetch;