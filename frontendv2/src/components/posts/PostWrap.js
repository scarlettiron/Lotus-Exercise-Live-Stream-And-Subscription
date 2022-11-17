import React, {useRef} from 'react'
import Post from './Post'
import '../../css/general.css'

const PostWrap = React.memo(({posts, handlePaginatePosts, handleSetHasPurchased, user=null}) => {
  
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

  return (
    <div className='post-container'>
        {posts.results.map((post, index) => {
          if(index + 1 === posts.results.length && posts.next){
            return <React.Fragment key={index}>
                    <Post 
                    post={post} 
                    liked={post.liked > 0 ? true : false}
                    hasPurchased = {post.purchased > 0 ? true : false}
                    handleSethasPurchased = {handleSetHasPurchased}
                    user = {user}
                    /> 
                    <div ref={handleTrackPosition}></div>
                    </React.Fragment>

            }
            return <Post 
                    key={index} 
                    post={post} 
                    handleSethasPurchased = {handleSetHasPurchased}
                    user = {user}
                    /> 
          })
        }
    </div>
  )
})

export default PostWrap