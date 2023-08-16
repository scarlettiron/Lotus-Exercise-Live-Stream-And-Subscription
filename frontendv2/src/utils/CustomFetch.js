import dayjs from 'dayjs'
import GetCookie from './GetCookie'
import jwt_decode from 'jwt-decode'
import {loginRefreshUrl} from './BaseInfo'
import { response } from 'express'


const updateToken = async (AuthTokens) => {
    if(AuthTokens?.refresh){
        const response = await fetch(loginRefreshUrl, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',

            },
            body:JSON.stringify({'refresh':AuthTokens?.refresh})
        })
        const data = await response.json()
        if(response.status === 200){
            localStorage.setItem('authTokens', JSON.stringify(data))
            return {response, data}
        }
        logoutUser()
    }
    
}

const logoutUser = () => {
    localStorage.removeItem('authTokens')
    localStorage.removeItem('user')
    localStorage.removeItem('UserProfile')
    window.location.path = '/login' 
}


const CustomFetchLegWork = async (dataUrl, fetchConfig={}, contentTypeOverRide=false) => {
    let AuthTokens = JSON.parse(localStorage.getItem('authTokens'))
    let User = jwt_decode(AuthTokens.access)
    let tokens = AuthTokens
    let expired = dayjs.unix(User.exp).diff(dayjs()) < 1

    if(expired){
        let {response, data} = await updateToken(AuthTokens)
        console.log(data)
        if('code' in data && data.code === "token_not_valid"){
            logoutUser()
        }
        if(response.status === 200){
            tokens = await data
        }
        else{ 
            return {response, data}}
    }


    const csrfToken = GetCookie('csrftoken')
   
    if(!fetchConfig['headers']){
        fetchConfig['headers'] = {}
    }

    //add csrf token and authorization access token to passed in fetch configuration headers
    if(csrfToken){
    fetchConfig['headers']['X-CSRFToken'] = csrfToken
    }
    fetchConfig['headers']['Authorization'] = 'Bearer ' + tokens.access
    
    if(!fetchConfig['headers']['Content-Type'] && !contentTypeOverRide){
        fetchConfig['headers']['Content-Type'] =  'application/json'
    }

    //continue with request
    let response = await fetch(dataUrl, fetchConfig)
    console.log(response)
    let data = {}
    if(response.status === 204){
        data = {'status':'deleted'}
    }
    else{
         data = await response.json()
         console.log(data)
    }


    // return fetch response
    return {response, data}
}
const CustomFetch = async (dataUrl, fetchConfig={}, contentTypeOverRide=false) => {
    try{
        const {response, data} = await CustomFetchLegWork(dataUrl, fetchConfig={}, contentTypeOverRide=false)
        return {response, data}
    }
    catch{
        const response = {status:400}
        const data = false
        return {response, data}
    }
}

export default CustomFetch;