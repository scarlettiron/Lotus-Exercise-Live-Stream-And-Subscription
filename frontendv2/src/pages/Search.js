import React, {useState, useEffect, useCallback, useRef} from 'react'
import SearchBar from '../components/search/SearchBar'
import SideBar from '../components/navbars/SideBar'
import { useParams} from 'react-router-dom'
import CustomFetch from '../utils/CustomFetch'
import { searchUsersUrl, postSearchUrl} from '../utils/BaseInfo'
import LoadingSpinner from '../components/general/LoadingSpinner'
import Button5 from '../components/general/Button5'
import UserListItem from '../components/search/UserListItem'
import PostWrap from '../components/posts/PostWrap'

import '../css/general.css'

const Search = () => {
  const {Q} = useParams()


  const search = useRef( Q ? Q : null)
  const [searchUsersResuslts, setSearchUsersResults] = useState(() => null)
  const [searchPostsResults, setSearchPostsResults] = useState(() => null)
  const [loading, setLoading] = useState(() => true)
  const previousQ = useRef(null)
  const [viewUsers, setViewUsers] = useState(() => true)

  const handleSetSearch = (e) => {
      search.current =  e.target.value
  }

  const searchType = async () => {
    if(viewUsers){handleSearchUsers()}
    if(!viewUsers){handleSearchPosts()}

  }

  const handleSearchUsers = async () => {
    if(!viewUsers){setViewUsers(() => true)}
    //!viewUsers && setViewUsers(() => true)
      
    if(search.current === previousQ.current && searchUsersResuslts){
      setLoading(false)
        return
      }
      
      setLoading(true)
      const fetchConfig ={method:'GET'}
      const {response, data} = await CustomFetch(`${searchUsersUrl}?q=${search.current}`, fetchConfig)

      if(response.status === 200){
        setSearchUsersResults(() => data)
        previousQ.current = search.current
        if(searchPostsResults){
          setSearchPostsResults(() => null)
        }
        setLoading(false)
      }
  }

  const handleSearchPosts = async () => {
    if(viewUsers){setViewUsers(() => false)}
    //viewUsers && setViewUsers(() => false)

    if(searchPostsResults && searchPostsResults.q === search.current){
      setLoading(false)
      return
    }

    setLoading(true)
    const fetchConfig = {method:'GET'}
    const {response, data} = await CustomFetch(`${postSearchUrl}?q=${search.current}`, fetchConfig)

    if(response.status === 200){
      setSearchPostsResults(() => data)
      previousQ.current = search.current
      setLoading(false)
    }
  }

  const handlePaginatePosts = useCallback(async () => {
    if(!searchPostsResults.next) return
    const fetchConfig = {method:'GET'}
    const {response, data} = await CustomFetch(searchPostsResults.next, fetchConfig)
    if(response.status === 200) {
      setSearchPostsResults((oldArray)=>({
            ...oldArray, results:[...oldArray.results, ...data.results], 
            next:data.next, previous:data.previous
        }))
    }
},[searchPostsResults, setSearchPostsResults])



const handlePaginateUsers = useCallback( async () => {
  const fetchConfig = {method:'GET'}
  const {response, data} = await CustomFetch(searchUsersResuslts.next, fetchConfig)
  if(response.status === 200){
    setSearchUsersResults((oldArray)=>({
      ...oldArray, results:[...oldArray.results, ...data.results], 
      next:data.next, previous:data.previous
  }))
  }
}, [setSearchUsersResults])



const observer = useRef()

const handleTrackPosition = element => {
  if(!searchUsersResuslts.next) return
  if(observer.current) {observer.current.disconnect()}
  observer.current = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting){
      handlePaginateUsers()
    }
  })
  if(element) {observer.current.observe(element)}
}



  useEffect(()=>{
    handleSearchUsers()
  }, [Q])


  return (
    <div className='main-container'>
        <div className='main-wrapper'>
        <div className='display-inline'>
                    <SideBar/>
                </div>
            <div className='display-inline'>
                <div className='container'>
                  <SearchBar inputOnChange={handleSetSearch} btnAction={searchType} placeholder='Search users and posts'/>
                  <div className='justify-content-space-around'>
                    <div className='display-inline'>
                      <Button5 text={'Users'}  action={handleSearchUsers} />
                    </div>
                    <div className='display-inline'>
                      <Button5 text={'Posts'} action={handleSearchPosts} />
                    </div>
                  </div>
                </div>
                <div className='container'>
                  {loading && <LoadingSpinner/>}
                  {viewUsers && searchUsersResuslts &&
                    searchUsersResuslts.results.map((user, index) => 
                    {return <UserListItem key={index} user={user} />})
                  }
                  {!loading && searchUsersResuslts && viewUsers &&
                    <div ref={handleTrackPosition}></div>
                  }
                  {searchPostsResults &&  
                    <PostWrap posts={searchPostsResults} 
                    handlePaginatePosts={handlePaginatePosts}
                    /> 
                  }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Search