import React, {useContext, useState} from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import SideBar from '../../components/navbars/SideBar'
import LoadingSpinner from '../../components/general/LoadingSpinner'
import { usersPostsListCreateUrl } from '../../utils/BaseInfo'
import CustomFetch from '../../utils/CustomFetch'
import CurrencyInput from 'react-currency-input-field'
import ResizingTextArea from '../../components/general/ResizingTextArea'
import FileInput from '../../components/general/FileInput'
import { ReactComponent as PhotoIcon } from '../../assets/photo-icon.svg'
import ResponsiveBtn from '../../components/general/ResponsiveBtn'
import ImgThumbnail from '../../components/general/ImgThumbnail'
import ErrorBanner from '../../components/general/errors/ErrorBanner'


const CreatePost = () => {
    const history = useHistory()
    const {User} = useContext(AuthContext)
    const [subscription, setSubscription] = useState(()=>false)
    const [postPrice, setPostPrice] = useState(0)
    const [media, setMedia] = useState(()=> [])
    const [body, setBody] = useState(()=> null)
    const [loading, setLoading] = useState(()=>false)
    const [error, setError] = useState(() => null)

    const controller = new AbortController()
    const signal = controller.signal

    const setPriceUnits = (value, name) => {
        const priceUnits = value * 100
        if(value > 0){ setPostPrice(priceUnits) }
    }

    const handleCancel = () => {history.goBack()}

    const abort = () => {
        controller.abort()
        setLoading(false)
    }

    const handleSetMedia = (e) => {
        media && setMedia([])

        setError(() => null)

        const files = e.target.files
            for(let i = 0; i <= e.target.files.length; i++){
                if(Math.floor(files[i].size) / 1000000 > 50){
                    setError("File cannot be greater than 50 mb")
                    setMedia(() => [])
                    break
                }
                const filePath = URL.createObjectURL(files[i])
                const image = {
                    'media':files[i],
                    'path':  filePath
                }
                setMedia(oldList => [...oldList, image])
            }
            return  
        }

    const handleSetBody = (e) => {
        setBody(e.target.value)
    }


    const handleCreatePost = async () => {
        setError(() => null)
        if(!body && !media) return
        setLoading(true)
        const payload = new FormData()

        payload.append('body', body)
        payload.append('subscription', subscription)
        payload.append('price_units', postPrice)

        if(media){
            for (let i = 0; i < media.length; i++){
            payload.append('media', media[i]['media'])
            } 
        }

        const fetchConfig = {method:'POST', signal:signal,  body:payload}
        const {response, data} = await CustomFetch(`${usersPostsListCreateUrl}${User.username}/`, fetchConfig, true) 
        if(response.status === 201){
            history.push(`/post/${data.id}`)
        }
        else{
            setError('Error creating post try again later')
            setLoading(false)
        }
    }

    const inputBtns = () => {
        const html = <>
                    <div className='display-inline'>
                        <PhotoIcon className='file-input-svg'/>
                    </div>
                    <div className='display-inline'>
                        <p className='text-muted' >Photo/Video</p>
                    </div>
                </>
        return html
    }

  return (
    <div>        
        <div className='main-container'>
            <div className='main-wrapper'>
            <div className='display-inline'>
                    <SideBar/>
                </div>
                <div className='display-inline'>
                    <div className='post-container temp'>
                        {loading && <LoadingSpinner btnAction={abort}/>}
                        <div className='justify-content-center w-100 padding-20'>
                            <h1 className='title-primary-text'>CREATE POST</h1>
                        </div>
                        <div className='justify-content-between w-100'>
                            <ResponsiveBtn 
                                btnWrapper={'display-inline margin-20'} 
                                text={'Cancel'} 
                                btnClass={'theme-secondary'} 
                                action={handleCancel}
                                />
                           <ResponsiveBtn 
                            btnWrapper={'display-inline margin-20'} 
                            text={'Create'} 
                            btnClass={'theme-primary'} 
                            action={!loading ? handleCreatePost : null}
                            />
                        </div>
                       {error &&
                        <ErrorBanner errorMessage = {error}/>
                       }

                        <ResizingTextArea 
                        wrapperClass={'post-input-wrapper temp'} 
                        name='formbody' 
                        placeholder='say something (optional)' 
                        onChange={handleSetBody} value={body}
                         />
                        <div className='margin-20'>
                            <FileInput
                             onChange={handleSetMedia} 
                             id='formmedia' 
                             multipleFiles={true} 
                            labelText={inputBtns()}/>
                        </div>
                        <div>
                            <div className='display-inline'>
                                <p className='text-paragraph'>Is this post exclusively for subscribers?</p>
                            </div>
                            <div className='display-inline margin-20'>
                                {subscription ? <ResponsiveBtn 
                                                btnWrapper={'display-inline margin-20'} 
                                                action={() => setSubscription(true)} 
                                                text={'Yes'} 
                                                btnClass={'theme-primary'}
                                                />
                                                : <ResponsiveBtn 
                                                btnWrapper={'display-inline margin-20'} 
                                                action={() => setSubscription(true)} 
                                                text={'Yes'} 
                                                btnClass={'theme-secondary'}
                                                />} 

                            {subscription ? <ResponsiveBtn 
                                            btnWrapper={'display-inline margin-20'} 
                                                action={() => setSubscription(false)} 
                                                text={'No'} 
                                                btnClass={'theme-secondary'}
                                                />
                                        : <ResponsiveBtn 
                                        btnWrapper={'display-inline margin-20'} 
                                        action={() => setSubscription(false)} 
                                        text={'No'} 
                                        btnClass={'theme-primary'} 
                                        />} 
                            </div>

                        </div>
                        <div className='post-price-wrapper margin-20'>
                            <div className='display-inline'>
                                <p className='text-paragraph'>Add a price (optional)</p>
                            </div>
                            <div className='display-inline'>
                                <CurrencyInput
                                id="postprice"
                                name="postprice"
                                placeholder="Enter a price (optional)"
                                decimalsLimit={2}
                                defaultValue={0}
                                maxLength={5}
                                onValueChange={(value, name) => setPriceUnits(value, name)}
                                prefix={'$'}
                                className={'price-input'}
                                />
                            </div>
                        </div>

                    <div className='create-post-thumbnail-wrapper'>
                        {media &&
                            media.map((item, index) => {
                                return  <ImgThumbnail 
                                        key={index} 
                                        image={item.path} 
                                        className='display-inline margin-10'
                                        />
                            })
                        }
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreatePost