import React, {createContext, useState} from 'react'

const ThemeContext = createContext()

export default ThemeContext;

export const ThemeProvider = ({children, ...rest}) => {
    let [DarkTheme, setDarkTheme] = useState(false)

    let changeTheme = () => {
        setDarkTheme(!DarkTheme)
    }

    let contextData = {
        DarkTheme:DarkTheme,
        changeTheme:changeTheme
    }

    return (

        <ThemeContext.Provider value={contextData}> 
            {children}
        </ThemeContext.Provider>
    )
}