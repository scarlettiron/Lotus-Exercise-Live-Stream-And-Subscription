import React, {useState, useEffect, useRef} from 'react'
import CustomFetch from '../../utils/CustomFetch'
import { userPurchases } from '../../utils/BaseInfo'
import Post from '../posts/Post'
import LoadingSpinner from '../general/LoadingSpinner'
import '../../css/general.css'

const ViewPurchasedPosts = () => {
    const {purchasedPosts} = userPurchases

    const [posts, setPosts] = useState(() => null)
    const [loading, setLoading] = useState(() => true)

    const handleGetPosts = async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(purchasedPosts.url, fetchConfig)
        console.log(data)
        if(response.status === 200){
            setPosts(() => data)
            setLoading(() => false)
        }
    }

    const handlePaginatePosts = async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(posts.next, fetchConfig)
        if(response.status === 200){
            setPosts((oldArray) => ({
                results:[...oldArray.results, data.results], 
                next:data.next, previous:data.previous, 
                ...oldArray
            }))
        }
    }

    const observer = useRef()

    const handleTrackPosition = element => {
      if(!posts.next) return
      if(observer.current) {observer.current.disconnect()}
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting){
          handlePaginatePosts()
        }
      })
      if(element) {observer.current.observe(element)}
    }

    useEffect(() => {
        handleGetPosts()
    }, [])

  return (
    <div className='w-100'>
        {loading &&
            <LoadingSpinner/>
        }

        { !loading && posts && posts.count > 0 &&
            posts.results.map((post, index) => {
                if(posts.next && index + 1 === posts.results.length){
                    return <React.Fragment key={index}>
                            <div ref={handleTrackPosition}></div>
                            <Post post={post.post} key={index}/>
                        </React.Fragment>
                }
                return <Post post={post.post} key={index}/>
            })
        }
    </div>
  )
}

export default ViewPurchasedPosts