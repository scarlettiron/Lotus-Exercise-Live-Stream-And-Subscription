import React, {useState, useContext, useEffect, useCallback} from 'react'
import { useParams } from 'react-router-dom';
import CustomFetch from '../../utils/CustomFetch';
import { userProfileUrl, usersPostsListCreateUrl } from '../../utils/BaseInfo';
import AuthContext from '../../context/AuthContext';
import SideBar from '../../components/navbars/SideBar';
import LoadingSpinner from '../../components/general/LoadingSpinner'
import ProfileHeader2 from '../../components/profiles/ProfileHeader2';
import Divider1 from '../../components/general/Divider1';
import About from '../../components/profiles/About';
import LiveSection from '../../components/profiles/LiveSection';
import PostWrap from '../../components/posts/PostWrap';

import '../../css/navbars.css'
import '../../css/general.css'
import '../../css/profile.css'

const Profile = React.memo(() => {
    const home = window.location.href.includes('/home')
    
    const {logoutUser, UserProfile} = useContext(AuthContext)
    const {username} = useParams()
    const [user, setUser] = useState(() => home ? UserProfile : null)
    const [posts, setPosts] = useState(null)
    const [loadingPosts, setLoadingPosts] = useState(true)

    const getUserProfile = useCallback(async () =>{
        if(home) return

        const config = {method:'GET'}
        const {response, data} = await CustomFetch(`${userProfileUrl}${username}`, config)
        if (response.status === 200){
            setUser(() => data)
        }
        else if(response.statusText === 'unauthorized'){
            logoutUser()
        }
        else{
            alert("Error could not get user")
        }
    }, [username, logoutUser])


    const getPosts = useCallback(async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(`${usersPostsListCreateUrl}${home ? user.username : username}`, fetchConfig)
        if(response.status === 200){
            if(data.count > 0){
                setPosts(() => data)
            }
            setLoadingPosts(() => false)
        }
    }, [username])

    const handlePaginatePosts = useCallback(async () => {
        if(!posts.next) return
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(posts.next, fetchConfig) 
        if(response.status === 200){
            setPosts(oldArray => ({
                ...oldArray, results:[...oldArray.results, ...data.results], 
                next:data.next, previous:data.previous}))
        }
    }, [posts, setPosts, username])

    const handleSetHasPurchased = (pk) => {
        setPosts(oldArray => ({
            ...oldArray, purchases: [...oldArray.purchases, parseInt(pk)]
        }))
    }

    
    useEffect(() => {
        const getData = async () => {
            if(!home){
                await getUserProfile()
            }
            await getPosts()
        }
        getData()
    },[username])

    return (
            
        <div className='display-inline'>
            <div className='container'>
                {user && <>
                <ProfileHeader2 user={user} />
                <Divider1 />
                <div className='container'>
                    <div className='secondary-wrapper'>
                        <About user={user}/>
                        <LiveSection />
                    </div>
                </div>
                </>
                }
                <Divider1 />
            </div>
            {loadingPosts && <LoadingSpinner/>}
            {posts && posts.count > 0 &&
                <PostWrap 
                user={user} 
                posts={posts} 
                handlePaginatePosts={handlePaginatePosts}
                handleSetHasPurchased={handleSetHasPurchased}
                />
            }                        
        </div> 
    )
})

export default Profile