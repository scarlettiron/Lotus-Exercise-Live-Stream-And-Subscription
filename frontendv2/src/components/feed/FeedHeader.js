import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import SearchBar from '../search/SearchBar'

import '../../css/general.css'

const FeedHeader = React.memo(() => {
const history = useHistory()

const [search, setSearch] = useState('')

const handleSetSearch = (e) => {
        let q = e.target.value
        setSearch(q)
    }
    
  const handleRedirect = () => {history.push(`/search/${search}`)}
  
  return (
    <div className='container justify-content-center'>
        <SearchBar inputOnChange={handleSetSearch} btnAction={handleRedirect} placeholder='Search site'/>
    </div>
  )
})

export default FeedHeader