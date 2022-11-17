import React, {createRef} from 'react'
import '../../css/general.css'
import '../../css/posts.css'
import '../../css/profile.css'
import '../../css/navbars.css'


const ResizingTextArea = ({maxHeight=null, 
  wrapperClass=null, inputClass=null, placeholder=null, name=null, onChange=null, 
  value=null, id=null, maxLength=null, maxRows}) => {
  let textRef = createRef()

  const inpClass = inputClass ? `${inputClass} resize-text-area` : 'resize-text-area' 

  function vh(max) {
    let height = window.innerHeight
    let maxH = Math.round((height * max) / 100)
    return maxH
  }

  const onChangeHandler = function(e) {
    if(onChange){
      onChange(e)
    }
    if(maxHeight){
      let maxInputHeight = vh(maxHeight)
      console.log(e.target.scrollHeight)
      if(textRef.current.offsetHeight >= maxInputHeight){
        textRef.current.style.overflow = 'scroll'
        return
      }
      textRef.current.style.height = "inherit"
      textRef.current.style.height = `${e.target.scrollHeight}px`
    }
    else{ 
      textRef.current.style.height = "inherit";
      textRef.current.style.height = `${e.target.scrollHeight}px`
    }
    
   };
  
    return (
    <div className={wrapperClass}>
        {value ? 
          <textarea ref={textRef} id={id} value={value} 
            name={name} className={inpClass} placeholder={placeholder}  
            onChange={onChangeHandler} max_length={maxLength}> 
          </textarea>
        :
          <textarea ref={textRef} id={id} name={name} className={inpClass} 
            placeholder={placeholder}  onChange={onChangeHandler} maxLength={maxLength}> 
          </textarea>
        }
    </div>
  )
}

export default ResizingTextArea