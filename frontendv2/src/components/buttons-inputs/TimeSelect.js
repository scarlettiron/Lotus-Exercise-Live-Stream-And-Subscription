import React from 'react'
import '../../css/general.css'

const TimeSelect = ({id, label, minutes=false}) => {

    const listHours = (len, hourKey) => {
        let rows = []
        let i = 0
        while(i++ < len){
            if(i >= 13){
                rows.push(<option key={`${hourKey}-${i}`} className={'select-input-option'} name={i} value={i}> {i - 12}</option>)
            }
            else{
                rows.push(<option key={`${hourKey}-${i}`} className={'select-input-option'} name={i}>{i}</option>)
            }
        }
        return rows
    }

    const amPm = () => {
        const options = ['am', 'pm']
        return options.map((x) => {return <option id={x} name={x} className={'select-input-option'}>{x}</option>})
    }


    const minuteOptions = () => {
        const minutes = ['15', '30', '45', '00']
        return minutes.map((x) => {return <option id={x} name={x} className={'select-input-option'}>{x}</option>})
    }

  return (
    <div className='w-100'>
        <div className='display-inline'>
            <p className='text-paragraph'>{label}</p>
        </div>
        <select id={`${id}_hour`} name={id} className='select-input temp'>
            {listHours(12, 'from').map((item) => {return item})}
        </select>
        {minutes &&
            <select id={`${id}_minutes`} name={`${id}_minutes`} className='select-input temp'>
                {minuteOptions()}
            </select>
        }
        <select id={`${id}_am_pm`} name={`${id}_am_pm`} className='select-input temp'>
            {amPm()}
        </select>

    </div>
  )
}

export default TimeSelect