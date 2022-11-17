const NoAuthFetch =  async (url, config={}) => {
    
    if(!config['headers']){
        config['headers'] = {}
    }

    if(!config['Content-Type']){
        config['Content-Type'] = 'application/json'
    }
    
    const response = await fetch(url, config)
    const data = await response.json()
    return {response, data}
}

export default NoAuthFetch