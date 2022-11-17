
//parameters: form  and optionalInput fields
// loops through all of the form input fields 
// optionalInputs takes an array of element ID's
// when looping through elements, compare current element to values in optionalInputs
// if element id is in optionalInputs   

const ValidateForm = (form, optionalInputs = [], ) => {
    let pass;
    let error;

    for (const element of form.target.elements) {
        let isOptional = optionalInputs.includes(element.id)
        if(!element.value && !isOptional && element.type !== 'submit'){
            pass = false
            error = element.name
            return {pass, error}
        }
    }
    pass = true
    error = null
    return {pass, error}
}


const validateFormCheckboxes = (form=null, passingNumber=0, optionalInputs=[]) => {
    let count = 0
    for (const element of form.target.elements){
        if(!element.type === 'checkbox') return

        if(element.checked ) {
            count = count + 1
        }
    }
    if(count >= passingNumber) return true

    return false
}

export {ValidateForm, validateFormCheckboxes};