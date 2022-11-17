import React, {useRef} from 'react'
import CommentItem from './CommentItem'
import '../../css/posts.css'

const Comments = ({comments, handlePagination}) => {
  const observer = useRef()

  const handleTrackPosition = element => {
    if(!comments.next) return
    if(observer.current) {observer.current.disconnect()}
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        handlePagination()
      }
    })
    if(element) {observer.current.observe(element)}
  }


  return (
    <div>
        {comments && comments.map((comment, index) => {
          if(comments.next && index + 1 === comments.results.length){
            return <>
                    <CommentItem key={index} comment={comment} />
                    <div ref={handleTrackPosition}></div>
                  </>
          }
          return <CommentItem key={index} comment={comment} />}
          
          )}
    </div>
  )
}

export default Comments