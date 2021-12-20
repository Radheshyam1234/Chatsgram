import React,{useState,useEffect,useRef} from 'react'
import moment from "moment"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthProvider } from '../Context/AuthProvider'
import "./ChatHeader"
import "./ChatFooter"
import RightPopup from "../../RightBar/RightDrawer/RightPopup"
import '../Chat/Chat.css'
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import GroupMessage from"./GroupMessage"
toast.configure()


const GroupChat = () => {
  const{newMessageFlag,activeGroup,socket,deletedGroupMessage,setDeletedGroupMessage}=useAuthProvider()
  const[incomingGroupMessage,setIncomingGroupMessage]=useState(false)
  const scrollRef=useRef(null);
  const[GroupChat,setGroupChat]=useState([])

    useEffect(()=>{
      
      fetch("http://localhost:8080/getgroupmessage",{
          headers:{
            "content-Type":"application/json",
          },
       method:"post",
          body: JSON.stringify({
                 groupId:activeGroup._id,
       }) 
  
         }).then(res=>res.json())
         .then(result=>{
          setGroupChat(result.messages)
         })

    },[newMessageFlag,activeGroup,incomingGroupMessage,deletedGroupMessage,])

    useEffect(()=>{
      scrollRef.current?.scrollIntoView({transition:'smooth'})
    },[GroupChat,newMessageFlag])


    useEffect(()=>{
      socket.current.on('getGroupMessage',data=>{
        var date=moment.utc().format()
        setIncomingGroupMessage({
          sender:data.senderId,
          message:data.text,
          type:data.type,
          createdAt:date

        })
      })

    },[])

 
    

    return (
      <>
        <div className="chat">
            <ChatHeader/>                     
         <div className="chat-body" >

         {
                GroupChat?<>
                {
                    GroupChat.map(message=>{
                        return(
                            < div key={message._id} ref={scrollRef}>
                            <GroupMessage 
                             message={message}
                            />
                            </div>
                        )
                    })
                }
                </>
                :
                "Chat is loading"
            }
            
         </div>

         <ChatFooter/>
        </div>
        <RightPopup/>
        </>
    )
}

export default GroupChat
