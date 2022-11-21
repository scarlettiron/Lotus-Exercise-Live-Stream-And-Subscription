import React, {createContext, useState, useEffect, useCallback} from "react";
import jwt_decode from 'jwt-decode'
import { loginUrl, loginRefreshUrl, tokenExp, authUserUrls} from "../utils/BaseInfo";
import { useHistory } from "react-router-dom";
import GetCookie from "../utils/GetCookie";
import CustomFetch from "../utils/CustomFetch";
import { userProfileUrl } from "../utils/BaseInfo";
import dayjs from 'dayjs'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = React.memo(({children}) => {

    const [AuthTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse((localStorage.getItem('authTokens'))) :  null)
    const [User, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(JSON.parse(localStorage.getItem('authTokens'))?.access) : null)
    const [UserProfile, setUserProfile] = useState(() => localStorage.getItem('UserProfile') ? JSON.parse(localStorage.getItem('UserProfile')) : null)
    const [loading, setLoading] = useState(() => true)
    const history = useHistory()

    const {passwordReset, passwordResetConfirm} = authUserUrls

    const loginUser = useCallback(async (username, password) => {
        const payload = {
            'username':username,
            'password':password
        }

        const response = await fetch(loginUrl, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body:JSON.stringify(payload)
        })
        if (response.status === 200){
            const data = await response.json()
            const user = jwt_decode(data.access)
            setAuthTokens(() => data)
            setUser(() => user)
            localStorage.setItem('authTokens', JSON.stringify(data))
            localStorage.setItem('user', JSON.stringify(user))
            const {ProfileResponse, ProfileData} = await getUserProfileInfo(user.username)
            if(ProfileResponse.status === 200){
                //if profile fetch is successful return error false
                return false
            }
            else{return "Try again could not get profile info"} 

        }
        else{
            return "Invalid login credentials"
        } 
    }, [setAuthTokens])

    const logoutUser = useCallback(() => {
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        localStorage.removeItem('user')
        setUser(null)
        localStorage.removeItem('UserProfile')
        setUserProfile(null)
        history.push('/login')
    },[setAuthTokens])



    const getUserProfileInfo = useCallback(async (user_id) => {
        const fetchConfig = {method:'get'}

        const {response, data} = await CustomFetch(`${userProfileUrl}${user_id}`, fetchConfig)
        if(response.status === 200){
            localStorage.setItem('UserProfile', JSON.stringify(data))
            setUserProfile(() => data)
        }
        else{
            logoutUser()
            return
        }
        
        const ProfileResponse = response
        const ProfileData = data
        return {ProfileResponse, ProfileData}
    },[setAuthTokens])
              

    
    const updateToken = useCallback(async () => {
        const csrf = GetCookie('csrftoken')
        const refresh = AuthTokens?.refresh
        if(refresh){
            const response = await fetch(loginRefreshUrl, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':csrf,
                },
                body:JSON.stringify({'refresh': refresh})
            })

            const data = await response.json()
            if('code' in data && data.code === "token_not_valid"){
                logoutUser()
            }

            if(response.status === 200){
                if (data.refresh){
                    localStorage.setItem('authTokens', JSON.stringify(data))
                    setAuthTokens(() => data)
                    const user = jwt_decode(data.access)
                    setUser(() => user)

                    if (!UserProfile){
                        await getUserProfileInfo(user.username)
                    }

                    if(loading){
                        setLoading(false)
                    }
                    return {response, data}
                }
            }
            else{
                logoutUser()
            }
        }

    },[AuthTokens, setAuthTokens, setUser, getUserProfileInfo])

    const handleSetUserProfile = (data) => {
        setUserProfile(data)
    }

    const resetPassword = async (email) => {
        const fetchConfig = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({email:email})
        }
        const response = await fetch(passwordReset.url, fetchConfig)
        return response
        
    }

    const confirmPasswordReset = async (uid, token, newPassword, verifyPassword) => {
        const fetchConfig = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({'uid':uid, 
                                'token':token,
                                'new_password':newPassword,
                                're_password':verifyPassword
                                })
        }
        const response = await fetch(passwordResetConfirm.url, fetchConfig)
        return response
    }


    const contextData = {
        loginUser:loginUser,
        logoutUser:logoutUser,
        User:User,
        setUser : setUser,
        UserProfile:UserProfile,
        handleSetUserProfile:handleSetUserProfile,
        AuthTokens:AuthTokens,
        setAuthTokens:setAuthTokens,
        updateToken:updateToken,
        resetPassword:resetPassword,
        confirmPasswordReset:confirmPasswordReset,
    }

     useEffect(() => {
         
        const updateData = async () => { await updateToken();}
        if(loading){
            if(!AuthTokens) return
            const User = jwt_decode(AuthTokens.access)
            const expired = dayjs.unix(User.exp).diff(dayjs()) < 1
            if(!expired) return 
            updateData()
        }

        const interval = setInterval(()=>{
            if(AuthTokens){
                updateData()
            }
        }, tokenExp)
        return ()=> clearInterval(interval)
    }, [AuthTokens, loading])
    

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
})


