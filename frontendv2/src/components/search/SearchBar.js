import React from 'react'
import Button2 from '../general/Button2'
import InputBox from '../general/InputBox'
import {ReactComponent as SearchIcon} from '../../assets/magnifying-glass.svg'

import '../../css/general.css'

const SearchBar = ({inputOnChange = null, btnAction = null, placeholder=''}) => {



      /* <div className='container justify-content-center'>
        <InputBox id='search' placeholder={placeholder} onChange={inputOnChange}/>
        <Button2 text={<SearchIcon className='drop-svg'/>} action={btnAction}/>
    </div> */
    const handleSearch =  (e) => {
      e.preventDefault()
      if(e.keyCode === 13){
        btnAction()
      }
      btnAction()
    }

    return (
    <form className='w-100 padding-20 justify-content-center' id='search-form' onSubmit={handleSearch}>
        <InputBox id='search' placeholder={placeholder} onChange={inputOnChange}/>
        <Button2 
        text={<SearchIcon className='drop-svg'/>} 
        form={'search-form'} 
        /* action = {btnAction} */
        />
    </form>

  )
}

export default SearchBar