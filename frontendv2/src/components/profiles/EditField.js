import React from 'react'
import '../../css/profile.css'
import '../../css/general.css'


const EditField = React.memo(({id='', value='', onChange=null, label='', type='text'}) => {
  console.log(value)
  return (
    <div class='edit-item-wrapper margin-30'>
        <p className='text-paragraph'>{label}</p>
        <input className='edit-input' name={id} id={id} value={value} onChange={onChange} type={type}/>
    </div>
  )
})

export default EditField