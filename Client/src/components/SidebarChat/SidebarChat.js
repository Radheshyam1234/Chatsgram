import{ React,useEffect,useState} from 'react'
import { Avatar } from '@material-ui/core'
import {getConversationId,GetChats} from "../Utility"
import { useAuthProvider } from '../Context/AuthProvider'
import{ AddPhotoAlternateOutlined,MicOutlined} from '@material-ui/icons';
import "./SidebarChat.css"
const SidebarChat = ({user,group}) => {
    const{userState,newMessageFlag,deletedmessage,isPersonalChat,isGroupChat,activeGroup,setActiveGroup}=useAuthProvider();
    const[messageArray,setMessageArray]=useState([])
    const[lastMessage,setLastMessage]=useState("")
  
  const getData=async()=>{

    const data=await getConversationId(userState._id,user._id)
    const message= await GetChats(data.data?._id)
    setMessageArray(message.messages)
  }

  useEffect(async ()=>{
     
  isPersonalChat && await getData()
   return ()=>{ setMessageArray()}
    
  },[newMessageFlag,deletedmessage])

  useEffect(()=>{
      setLastMessage(messageArray[messageArray.length-1])
      return ()=>{setLastMessage()}
  },[messageArray])


    return (
      
        isPersonalChat ?
        <div className="sidebar-chat">
           <Avatar src={user.profilephoto}/> 
           <div className="sidebar-chat-info">
               <h2>{user.name}</h2>
               <p>
                   { lastMessage  ?
                (lastMessage.type==="image" ? <AddPhotoAlternateOutlined/>:
                (lastMessage.type==="audio" ?  <MicOutlined/>
                 :(lastMessage.message.length>20?
                `${lastMessage.message.slice(0,20)}...`
                : lastMessage.message)
                ))
                :""
                 }  
            </p>
            
           </div>
           
        </div>
      
  :
      <div className="sidebar-chat">

       <Avatar src={group.profilephoto} />
      
         <div className="sidebar-chat-info">
             <h2>{group.name}</h2>
             {/* <p>
                 { lastMessage  ?
              (lastMessage.type==="image" ? <AddPhotoAlternateOutlined/>:
              (lastMessage.type==="audio" ?  <MicOutlined/>
               :(lastMessage.message.length>20?
              `${lastMessage.message.slice(0,20)}...`
              : lastMessage.message)
              ))
              :""
               }  
          </p> */}
          
         </div>
         
      </div>
    



        
    )
}

export default SidebarChat
