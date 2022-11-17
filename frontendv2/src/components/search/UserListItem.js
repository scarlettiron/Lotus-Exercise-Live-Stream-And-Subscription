import React, {useState} from 'react'
import About from '../profiles/About'
import{ReactComponent as ArrowDown} from '../../assets/chevron-down-circle.svg'
import{ReactComponent as ArrowUp} from '../../assets/chevron-up-circle.svg'
import Button2 from '../general/Button2'
import ProfilePicBtn from '../general/ProfilePicBtn'
import LinkBtn from '../general/LinkBtn'

import '../../css/search.css'
import '../../css/general.css'
import '../../css/posts.css'

const UserListItem = ({user}) => {
    const [dropDown, setDropDown] = useState(false)

    const toggle = () => {setDropDown(!dropDown)}

  return (
    <div className='container'>
        <div className='search-user-container'>
            <div className='display-inline'>
            <div className='post-header-pic-username-wrapper'>
                <div className='display-inline'>
                    <ProfilePicBtn user={user} btnClass='search-profile-pic-wrapper' />
                </div>
                <div className='post-username-wrapper'>
                    <p className='post-username'>@{user?.username}</p>
                </div>
            </div>
            </div>
            <div className='display-inline w-50'>
                <div className='search-user-split-containers justify-content-end'>
                    <div className='margin-tb-auto'>
                        <LinkBtn link={`/user/${user.username}`} text='View Profile' />
                    </div>
                    <div className='margin-tb-auto'>
                        {dropDown ? <Button2 text={<ArrowUp/>} action={toggle}/> : <Button2 text={<ArrowDown />} action={toggle}/>}
                    </div>
                </div>
            </div>
        </div>
        {dropDown &&
            <div className='search-user-container'>
                <About user={user} />
            </div>   
        }    
    </div>
  )
}

export default UserListItem