
const formInputChecker = (e, setError, optional_inputs = []) => {
    const input_types = ['INPUT']
    const elements = e.target.elements
    for (let x in elements){
        if(input_types.includes(elements[x].nodeName)){
            if(!optional_inputs.includes(elements[x].name) && elements[x].name !== 'placeholder' && !elements[x].value){
                setError(elements[x].name)
                return true
            }
        }
    }
    return false
}

export default formInputChecker