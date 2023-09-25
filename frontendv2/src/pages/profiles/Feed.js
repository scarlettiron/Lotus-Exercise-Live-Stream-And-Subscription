import React, {useEffect, useState, useCallback, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import NoAuthFetch from '../../utils/NoAuthFetch'
import PostWrap from '../../components/posts/PostWrap'
import { userFeedUrl } from '../../utils/BaseInfo'
import SideBar from '../../components/navbars/SideBar'
import FeedHeader from '../../components/feed/FeedHeader'
import LoadingSpinner from '../../components/general/LoadingSpinner'


const Feed = React.memo(() => {
    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)

    const {UserProfile} = useContext(AuthContext)

    const handlePaginatePosts = useCallback(async () => {
        if(!posts.next) return
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(posts.next, fetchConfig)
        if(response.status === 200) {
            setPosts((oldArray)=>({
                ...oldArray, results:[...oldArray.results, ...data.results], 
                next:data.next, previous:data.previous
            }))
        }
    },[posts, setPosts])

    const getPosts = useCallback(async () => {
        console.log('fetching posts')
        const fetchConfig = {method:'GET'}
        if(UserProfile){
            const {response, data} = await CustomFetch(userFeedUrl, fetchConfig)
            if(response.status === 200){
                setPosts(() => data)
                setLoading(()=> false)
            }
        }
        else{
            const {response, data} = await NoAuthFetch(userFeedUrl, fetchConfig)
            if(response.status === 200){
                console.log(data)
                setPosts(() => data)
                setLoading(()=> false)
            }
        }

    },[setPosts])


    useEffect(()=>{
        getPosts()
    }, [])

  return (
        <div className='container'>
            <FeedHeader />
            {loading && <LoadingSpinner/>}
            {posts  &&
                <PostWrap 
                posts={posts} 
                handlePaginatePosts={handlePaginatePosts}
                />
            }
        </div>
  )
})

export default Feed