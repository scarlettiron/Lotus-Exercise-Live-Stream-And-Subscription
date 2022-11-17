import React, {useState} from 'react'
import ProfilePicBtn from '../general/ProfilePicBtn'
import DropDownDotsBtn from '../general/DropDownDotsBtn'
import DropDownItem from '../general/DropDownItem'
import {convertToFormattedSiteDate} from '../../utils/DateFunctions'
import '../../css/posts.css'
import '../../css/general.css'

const PostHeader = ({post, toggleDeletePopup}) => {
  const windowLocation = window.location.pathname.includes('/post/')
  const formDate = convertToFormattedSiteDate(post.date)

  const [dropDown, setDropDown] = useState(false)

  const toggle = () => {setDropDown(!dropDown)}

  return (
    <div className='post-header-wrapper'>
      <div className='post-header-pic-username-wrapper'>
        <div className='display-inline'>
            <ProfilePicBtn user={post.user} wrapperClass={'post-profile-pic-wrapper'}/>
        </div>
        <div className='post-username-wrapper'>
            <p className='post-username'>@{post.user.username}</p>
        </div>
      </div>
      <div className='display-inline'>
        <div className='dot-wrapper'>
          <DropDownDotsBtn svgClass={"post-dropdown-dots float-right"} action={toggle}/>
          {dropDown && <>
            <div className='drop-wrapper post-dropdown-width temp'>
              {!windowLocation && dropDown &&
                  <DropDownItem text={'View Post'} link={`/post/${post.id}`} />
                }
                {post.is_owner && <>
                  <DropDownItem text={'Edit'} link={`/post/edit/${post.id}`} />
                  <DropDownItem text={'Delete'} action={toggleDeletePopup}/>
                </>}
            </div>
          </> }
        </div>
        <p className='text-muted'>{formDate}</p>
      </div>
    </div>
  )
}

export default PostHeader