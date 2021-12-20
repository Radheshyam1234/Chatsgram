
export const initialState=null;



export const userReducer=(userState,action) =>{

    if(action.type==="LOGOUT")
{
    return null
}

    if(action.type==="USER")
    {
        return action.payload
    }

    else if(action.type==="UpdatedProfilePic"){
        return {
            ...userState,
           
            profilephoto:action.payload.profilephoto
        }
    }
    
    else  if(action.type==="UpdatedProfileName"){
        return {
            ...userState,
           
            name:action.payload.profilename
        }
    }

    else if(action.type==="UpdatedBio"){
        return {
            ...userState,
            about:action.payload.about
        }
    }

    else if(action.type=="ADDSTARMESSAGE"){
        return {
            ...userState,
            starredmessage:action.payload.starredmessage
        }
    }

    else if(action.type=="REMOVESTARMESSAGE"){
        return {
            ...userState,
            starredmessage:action.payload.starredmessage
        }
    }
    return userState
}