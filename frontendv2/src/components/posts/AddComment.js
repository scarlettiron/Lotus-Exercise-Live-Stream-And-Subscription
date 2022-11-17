import React, {useContext, useState} from 'react'
import AuthContext from '../../context/AuthContext'
import CustomFetch from '../../utils/CustomFetch'
import {commentListCreateUrl} from '../../utils/BaseInfo'
import { useParams } from 'react-router-dom'
import Button2 from '../general/Button2'
import {ReactComponent as Plane} from '../../assets/paper-plane.svg'


const AddComment = ({updateCommentsList}) => {
    const {User, UserProfile} = useContext(AuthContext)
    const [comment, setComment] = useState()
    const [creatingComment, setCreatingComment] = useState(false)
    const [error, setError] = useState(false)
    const postId = useParams("postid")

    const handleSubmitComment = async () => {
        if(!comment && comment === "" && comment === " ") return
        setCreatingComment(true)
        let fetchConfig = {method:'POST', 
        body:JSON.stringify({post:postId.postid, user:User.user_id, body:comment})
        }

        let {response, data} = await CustomFetch(commentListCreateUrl, fetchConfig)
        if(response.status === 201){
            data.user = UserProfile
            updateCommentsList(data)
            setComment("")
        }
        else{
            setError(true)
        }

        setCreatingComment(false)
    }

    const handleOnchange = (e) => {
        if(error === true){
            setError(false)
        }
        setComment(e.target.value)
    }

  return (
    <div>
        {error && 
        <>
        <div className='w-100 margin-10 justify-content-center'>
            <h4 className='margin-auto'>Error try again later</h4>
        </div>
        </>}
        <div className='comment-input-wrapper'>
             <input max_length='500' className='comment-input' onChange={(e) => {handleOnchange(e)}} 
             placeholder="leave a comment" value={comment} rows='5'/>

                <Button2 action={handleSubmitComment} text={<Plane className='comment-btn' viewBox="0 0 97.103 97.104" />} disabled={creatingComment}/>
        </div>
    </div>
  )
}

export default AddComment