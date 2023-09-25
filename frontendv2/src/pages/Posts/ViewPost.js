import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import CustomFetch from '../../utils/CustomFetch'
import Post from '../../components/posts/Post'
import { postDetailUpdateDelete} from '../../utils/BaseInfo'
import Comments from '../../components/posts/Comments'
import AddComment from '../../components/posts/AddComment'
import LoadingSpinner from '../../components/general/LoadingSpinner'
const ViewPost = () => {
    const {postid} = useParams()
    const [loading, setLoading] = useState(true)
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState(null)

    useEffect(() => {
         getPost()
    },[postid])
    

    const getPost = async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(`${postDetailUpdateDelete}${postid}`, fetchConfig)

        if (response.status === 200){
            setPost(data)
            setComments(data.comments)
            setLoading(false)
        }
    }

    const updateCommentsList = (newComment) => {setComments([newComment, ...comments])}

    const handleSetHasPurchased = (pk) => {
        setPost(oldArray => ({
            ...oldArray, purchases: [parseInt(pk)]
        }))
    }

    const handleCommentsPagination = async () => {
        const fetchConfig = {method:'GET'}
        const {response, data} = await CustomFetch(comments.next, fetchConfig)
        if(response.status === 200){
            setComments(oldArray => ({
                results:[...oldArray.results, data.results],next:data.next, ...oldArray
            }))
        }
    }
  return (
        <div className='display-inline  m-20'>
                <div className='post-container'>
                    {loading && <LoadingSpinner/>}
                    {post &&
                        <Post  
                        post={post} 
                        user={post.user} 
                        likes={post.likes}
                        hasPurchased={post.purchases}
                        handleSetHasPurchased={handleSetHasPurchased}
                        />
                    }
                </div>
                
                {!loading &&
                <div className='container border-transparent'>
                    <div className='container border-transparent'>
                        <AddComment updateCommentsList={updateCommentsList} post={post} />
                    </div>
                    {comments &&
                        <div className='container'>
                            <Comments 
                            comments={comments} 
                            handlePagination={handleCommentsPagination}
                            />
                        </div>
                    }
                </div>
                }
        </div>
  )
}

export default ViewPost