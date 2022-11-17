import React, {useState, useEffect, useRef, useCallback, useContext} from 'react'
import CustomFetch from '../../utils/CustomFetch'
import AuthContext from '../../context/AuthContext';
import { useHistory, useParams } from 'react-router-dom'
import {classUrls} from '../../utils/BaseInfo';
import Divider2 from '../general/Divider2'
import LiveClassItem from './LiveClassItem'
import Button2 from '../general/Button2'
import {ReactComponent as Plus} from '../../assets/plus.svg'


import '../../css/profile.css'

const LiveSection = React.memo(() => {
  const history = useHistory()
  const {username} = useParams()

  const {listCreateLiveClassUrl} = classUrls

  const {UserProfile} = useContext(AuthContext)

  const [displayedClasses, setDisplayedClasses] = useState()
  const [dropDown, setDropdown] = useState(false)
  const [classes, setClasses] = useState(null)

  const toggle = () => {setDropdown(!dropDown)} 


  const getClasses = useCallback( async () => {
    const fetchConfig = {method:'GET'}
    const instructor = username ? username : UserProfile.username
    const {response, data} = await CustomFetch(`${listCreateLiveClassUrl.url}${instructor}`, fetchConfig)
    
    if(response.status === 200){
      setClasses(() => data)
    }

  }, [username])


  const handlePaginateClasses = useCallback(async () => {
    if(!classes.next) return
    
    const fetchConfig = {method:'GET'}
    const {response, data} = await CustomFetch(classes.next, fetchConfig) 
    if(response.status === 200){
        setClasses(oldArray => ({
            ...oldArray, results:[...oldArray.results, ...data.results], 
            next:data.next, previous:data.previous}))
    }
}, [classes, setClasses])


  const handleDisplayClasses = () => {
    if(!dropDown){
      if(classes.results.length >= 3){
        let newArray = [...classes.results]
        let classArray = newArray.splice(0, 3)
        setDisplayedClasses(classArray)
        return
      }
    }
    setDisplayedClasses(classes.results)
  }

  const observer = useRef()

  const handleTrackPosition = element => {
    if(!classes.next) return
    if(observer.current) {observer.current.disconnect()}
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        handlePaginateClasses()
      }
    })
    if(element) {observer.current.observe(element)}
  }


  useEffect(() => {
    getClasses()
  }, [])

  useEffect(() => {
      if(!classes) return
      handleDisplayClasses()
    }
  ,[dropDown, setClasses, classes])

  return (
    <div className='sub-container padding-30'>
      {username === UserProfile.username || window.location.pathname === '/home'? <>
        <div className='justify-content-between'>
          <p className='title-secondary-text display-inline'>Live Video Classes</p>
          <Button2 action={()=> {history.push('/class/create/')}} text={<Plus className={'add-svg'} viewBox="0 0 32 32"/>} />
        </div>
      </>
      :  <p className='title-secondary-text'>Live Video Classes</p>
      }
        <Divider2 />
        <div className='secondary-wrapper margin-top-20'>
           {displayedClasses && displayedClasses.length > 0 &&
              displayedClasses.map((item, index) => {
                        if(index + 1 === classes.results.length && classes.next){
                          return <React.Fragment key={index}>
                            <LiveClassItem key={index} item={item} />
                            <div ref={handleTrackPosition}></div>
                          </React.Fragment>
                        }
                        return <LiveClassItem key={index} item={item} />
            })}
            {dropDown && classes.next && 
              <div ref={handleTrackPosition}></div>
            }
        </div>
        {classes && classes.results.length > 3 &&
          <div class='about-show-btn-wrapper'>
              { dropDown ? <Button2 action={toggle} text={"Less"} /> :
                <Button2 action={toggle} text={"More Classes"} /> 
              } 
          </div>
        }
    </div>
  )
})

export default LiveSection