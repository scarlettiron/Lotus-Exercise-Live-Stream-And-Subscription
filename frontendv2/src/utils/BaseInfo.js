//API ENDPOINTS
const isDevLocal = true

const baseApiUrl = isDevLocal ? process.env.REACT_APP_SERVER_NAME_LOCAL : process.env.REACT_APP_SERVER_NAME

const siteUrl = isDevLocal ? process.env.REACT_APP_SERVER_NAME_LOCAL : process.env.REACT_APP_SITE_URL

const serverUrl = isDevLocal ? process.env.REACT_APP_SERVER_URL_LOCAL : process.env.REACT_APP_SERVER_URL

                    //socket URLS

const socketUrls = {
    privateMessage: {url:'ws/chat', decription:`for private messaging add thread pk 
    and /to end`, types:['chat_message', 'call_notification']},
    
    PrivateVideoCallSocket: {url:'ws/private-video-call/', description:`for private video calling 
    add thread pk and / to end`, types:['privateVideoCall', 'iceCandidate']},
   
    PrivateChatCallSocket:{url:'ws/private_chat_call/', 
        description:`for private chats and private one to one peer calling via simple peer
        add thread id to end of url`,
        types:['chat_message', 'call_request', 'accept_call_request', 'decline_call_request']
    },

    groupClassSocket:{
        url: 'ws/group-class/',
    }
}

                    //LOGIN TOKEN URLS//
//Initial access and refresh tokens, requires username and password
//methods: POST
const loginUrl = `${baseApiUrl}users/token/`
//New access tokens, requires users refresh token
//methods: POST
const loginRefreshUrl = `${baseApiUrl}users/token/refresh/`
const tokenExp = 1000 * 60 * 4
                    
                        //USER URLS//
//Detail and update specific user profile, requires pk in url positional argument
//methods:GET, PUT
const userProfileUrl = `${baseApiUrl}users/detail/` // add user primary key and / to end 

// update user subscription price
const updateSubscriptionPriceUrl = `${baseApiUrl}users/subscription-price-update/`

//Create new user. Requires username, password and email.
//methods: POST
const createUserUrl = `${baseApiUrl}users/create/`

//Get list of all users
//methods:GET
const listUsersUrl = `${baseApiUrl}users/list/`

//Search through user usernames and profile bios for keywords, requires ?q param
//methods:GET
const searchUsersUrl = `${baseApiUrl}users/search-complex/` //add ?q={user_search} to end


const authUserUrls = {
    passwordReset:{
        url : `http://${siteUrl}/auth/users/reset_password/`
    },
    passwordResetConfirm:{
        url: `http://${siteUrl}/auth/users/reset_password_confirm/`
    }
}




                            /// VERIFICATION ///
// handle anything to do with verifying if user is a legitimate instructor
const verificationUrls = {
    //get verification details
    //add user id to end
    verificationDetail : {
        url:`${baseApiUrl}verifications/detail`, 
        methods:['GET'],
    },
    //create instructor verification request, 
    //requires user to submit a photoId and a copy of a certificate
    //add user id to end
    verificationCreate : {
        url : `${baseApiUrl}verifications/detail`, 
        methods:['POST'],
    }
}



                             /// FEED ///
const userFeedUrl = `${baseApiUrl}posts/feed/`

                            ///LIVE CLASSES///
//List all Live session packages belonging to a user or create a new one
//methods: GET, POST
//const listCreateLiveClassUrl = `${baseApiUrl}liveclasses/list/` //add user id to end

//Get Live session package detail, update or delete it
//methods:GET, PUT, DELETE
const liveClassDetail = `${baseApiUrl}liveclasses/detail` // add session pk to end


                            ///FOLLOWS ///
//get all creators user is following or create a follow
//methods:GET, POST
const followingListCreateUrl = `${baseApiUrl}follows/following/`

//delete/ unfollow a user
//methods:DELETE
const unfollowUserUrl = `${baseApiUrl}follows/detail/` //add creator pk to end



            ///SUBSCRIPTIONS///
const subscriptionUrls = {
    cancelSubscription:{
        url:`${baseApiUrl}subscriptions/subscription-cancel`,
        methods:'PUT',
        description:`Cancels subscription. Add creator id to end of url.`
    }, 
    subscribersList : {
        url:`${baseApiUrl}subscriptions/subscribers-list/`,
        methods:'GET',
        description: 'get all of users subscribers'
    },
    subscriptionsList : {
        url:`${baseApiUrl}subscriptions/subscriptions-list/`,
        methods:'GET',
        description:'get all of users subscriptions'
    },
    subscriptionDetail:{
        url:`${baseApiUrl}subscriptions/detail/`,
        methods: 'GET',
        description:'get subscription detail'
    }
}


                ////POST URLS ////
//get all users posts or create new post with media
//methods:GET, POST
const usersPostsListCreateUrl = `${baseApiUrl}posts/list-create/`// add username to end

//get post detail
//methods:GET, UPDATE, DELETE
const postDetailUpdateDelete = `${baseApiUrl}posts/detail/` //add post pk


//search posts
//methods:GET
const postSearchUrl = `${baseApiUrl}posts/search-complex/`// add ?q={user_search} to end

//create or list all of users likes
//methods:GET, POST
const createListLikeUrl = `${baseApiUrl}likesunlikes/list-create/` //add user to end

//delete like
//methods:DELETE
const deleteLikeUrl = `${baseApiUrl}likesunlikes/detail-delete/` // add user and post
//in fetch body

//create post comments
//methods:POST
const commentListCreateUrl = `${baseApiUrl}comments/create-list/`


                    /// CHAT URLS ///

//Create thread or list all threads belonging to user
//methods: GET, POST
const listCreateThread = `${baseApiUrl}chat/user-threads/`

//get all messages belonging to a thread
//methods: GET
const getThreadMessages = `${baseApiUrl}chat/user-messages/`

const chatUrls = {
    //Create thread or list all threads belonging to user
    //methods: GET, POST
    listCreateThread:{url:`${baseApiUrl}chat/user-threads/`,
                      description:'Create thread or list all threads belonging to a user',
                      methods:'GET, POST'},


    getThreadMessages:{url: `${baseApiUrl}chat/messages`,
                        description:`add thread pk to end. returns all messages belonging
                        to a thread, as well as current thread information and user info`,
                        methods:'GET, POST'
                    },
    

    //optimized version
    //get all messages belonging to a thread, ass well as all threads belonging to a user
    //methods: GET
    getThreadMessagesOptimized:{url: `${baseApiUrl}chat/thread-messages/`,
                        description:'get all messages belonging to a thread',
                        methods:'GET'}
}

const classUrls = {
    //List all Live session packages belonging to a user or create a new one
//methods: GET, POST
listCreateLiveClassUrl : {url:`${baseApiUrl}liveclasses/list/`}, //add user id to end

//Get Live session package detail, update or delete it
//methods:GET, PUT, DELETE
liveClassDetail : `${baseApiUrl}liveclasses/detail` // add session pk to end
}

            //booking and appointments//

const bookingUrls = {
    classSessionDetail : {
        url : `${baseApiUrl}bookings/class-session/detail`,
        methods : ['GET', 'PUT']
    },
    userAppointmentsList : {
        url : `${baseApiUrl}bookings/appointments/list`,
        methods : ['GET']
    }
}

                ///transactions ///

const transactionsUrls = {
    transactionsList:{
        url: `${baseApiUrl}user-transactions/list`,
        methods:['GET']
    }
}

const checkoutUrls = {
    purchasePost:{
        url:`${baseApiUrl}checkout/purchase-post`,
        description:`must use this url for initializing payment intent along with
        confirmPurchasePost.url to confirm that payment and create local records of
        transactions`,
        methods:'POST'
    },
    confirmPurchasePost:{
        url: `${baseApiUrl}checkout/purchase-post`,
        methods:'PUT',
    },
    purchaseSubscription : {
        url: `${baseApiUrl}checkout/purchase-subscription`,
        methods:'POST',
    },
    confirmPurchaseSubscription : {
        url : `${baseApiUrl}checkout/purchase-subscription`,
        methods:'PUT',
    },
    purchaseClass : {
        url : `${baseApiUrl}checkout/purchase-class`,
        methods:'POST',
    },
    confirmPurchaseClass : {
        url : `${baseApiUrl}checkout/purchase-class`,
        methods:'PUT'
    }
}

            ////View Purchases ////
const userPurchases = {
    purchasedPosts : {
        url : `${baseApiUrl}user-transactions/purchased-posts/`,
    }
}

            ////NOTIFICATIONS/////

const userNotificationsUrls = {
    viewAllNotifications : {
        url: `${baseApiUrl}usernotifications/list/`,
        methods : ['GET'],
        description : `returns all notifications for user making request`
    }
}



export {baseApiUrl, siteUrl, serverUrl, socketUrls, createUserUrl, updateSubscriptionPriceUrl, loginUrl, loginRefreshUrl, userProfileUrl, userFeedUrl, 
    authUserUrls, listUsersUrl, searchUsersUrl, tokenExp, verificationUrls, liveClassDetail,
classUrls, followingListCreateUrl , unfollowUserUrl, subscriptionUrls,
usersPostsListCreateUrl, bookingUrls, transactionsUrls,
createListLikeUrl, deleteLikeUrl, postDetailUpdateDelete, commentListCreateUrl, 
postSearchUrl, chatUrls, checkoutUrls, userPurchases, userNotificationsUrls}