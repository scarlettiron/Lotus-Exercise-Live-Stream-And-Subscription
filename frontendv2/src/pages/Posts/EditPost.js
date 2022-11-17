import React, {useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import { useParams } from 'react-router-dom'
import CustomFetch from '../../utils/CustomFetch'
import SideBar from '../../components/navbars/SideBar'
import { postDetailUpdateDelete } from '../../utils/BaseInfo'
import Button1 from '../../components/general/Button1'
import { useHistory } from 'react-router-dom'

const EditPost = () => {
    let {UserProfile} = useContext(AuthContext)
    let history = useHistory()
    let {postid} = useParams('postid')

    let [post, setPost] = useState({})
    let [postBody, setPostBody] = useState(post ? post.body : null)

    
    let getPost = async () => {
        let fetchConfig = {method:'GET'}
        let {response, data} = await CustomFetch(`${postDetailUpdateDelete}${postid}`, fetchConfig)
        if(response.status === 200){
            setPost(data)
            setPostBody(data.body)
        }
    }

    let handleUpdatePost = async () => {
        let fetchConfig = {method:'PUT', body:JSON.stringify({body:postBody})}
        let {response, data} = await CustomFetch(`${postDetailUpdateDelete}${postid}`, fetchConfig)
        if(response.status === 200){
            history.push(`/post/${post.id}`)
        }
    }

    useEffect(()=>{
        getPost()
    },[postid])



  return (
    <div>        
        <div className='main-container'>
            <div className='main-wrapper'>
            <div className='display-inline'>
                    <SideBar/>
                </div>
                <div className='display-inline'>
                    <div className='container'>
                        <div className='post-container'>
                            <div className='justify-content-between padding-10'>
                                <Link to={`/user/${UserProfile.username}`}>
                                    <Button1 text={'Cancel'} action={() => history.goBack()}/>
                                </Link>
                                <Button1 action={handleUpdatePost} text={<span className='margin-10'>Save</span>} />
                            </div>
                            <div className='post-text-wrapper'>
                                <textarea onChange={(e) => setPostBody(e.target.value)} value={postBody} className='post-edit-textarea'>

                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditPost