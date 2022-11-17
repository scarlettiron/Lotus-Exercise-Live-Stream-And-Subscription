import React, {useState} from 'react'
import Button2 from '../general/Button2'
import '../../css/posts.css'
import '../../css/general.css'

const PostTextBody = ({post}) => {
    const [dropdown, setDropdown] = useState(false)

    const toggle = () => {setDropdown(!dropdown)}

    const truncate = () => {
        let body = post.body
        let truncated = body.substring(0, 300)
        let truncatedString = `${truncated}...`
        return truncatedString
      }
    
  return (
    <div className='post-text-wrapper'>
        {post?.body.length > 300 ?  
        (dropdown ? <> 
          <p className='text-paragraph text-indent'> {post.body} </p>
          <div className='post-text-btn-wrapper'>
            <Button2 action= {toggle} text='Less'/> 
          </div></>
          
          : <> 
            <p className='text-paragraph text-indent'> {truncate()} </p>
            <div className='post-text-btn-wrapper'>
                <Button2 action= {toggle} text='More'/>
            </div>
          </>)
        :
          <p className='text-paragraph text-indent'> {post.body} </p>}
    </div>
  )
}

export default PostTextBody