import React from 'react'
import {ReactComponent as MediaUplaodBtn} from '../../assets/heart-liked.svg'

const FileInput = ({id=null, classWrapper=null, multipleFiles=false, labelText=null, onChange={}}) => {
  return (
    <div className={classWrapper}>
        {multipleFiles ? 
            <>
                <label htmlFor={id}>
                    <input multiple  id={id} onChange={onChange} name={id} type='file' accept='image/jpeg, image/png, video/mp4' hidden/> 
                    {labelText ? labelText : <MediaUplaodBtn />}
                </label>
            </>
            :   
            <>
                <label htmlFor={id}>
                    <input id={id} name={id} onChange={onChange}  type='file' accept='image/jpeg, image/png, video/mp4' hidden/>  
                    {labelText ? labelText : <MediaUplaodBtn />}
                </label>
            </>
        }
    </div>
  )
}

export default FileInput