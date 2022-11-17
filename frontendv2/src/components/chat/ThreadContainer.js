import React, {useRef} from 'react'
import ThreadItem from './ThreadItem'
import '../../css/chat.css'
import LoadingSpinner from '../general/LoadingSpinner'



const ThreadContainer = React.memo(({loading, User, threads, 
  handlePaginateThreads, inboxHome=false}) => {
    const observer = useRef()

    const handleTrackPosition = element => {
      if(!threads.next) return
      if(observer.current) {observer.current.disconnect()}
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting){
          handlePaginateThreads()
        }
      })
      if(element) {observer.current.observe(element)}
    }



    return (
    <div className={inboxHome ? 'inbox-container inbox': 'inbox-container'}>
        <div className='inbox-header'>
            <div className='justify-content-center margin-10'>
                <h2 className='title-secondary-text'>Inbox</h2>
            </div>
        </div>
        {loading && <LoadingSpinner/>}
        {threads && threads.count > 0 &&
          threads.results.map((thread, index) => {
            if(index + 1 === threads.results.length && threads.next){
              return <React.Fragment key={index}>
                  <div ref={handleTrackPosition}>
                    <ThreadItem key={index} thread={thread} User={User} />
                  </div>
              </React.Fragment> 
            }
            else{
              return <ThreadItem key={index} thread={thread} User={User} />
            }
          })
        }
        {threads.next &&
            <div ref={handleTrackPosition}> </div>
        }
    </div>
  )
})

export default ThreadContainer