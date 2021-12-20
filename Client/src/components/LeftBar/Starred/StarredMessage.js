import React,{useState,useEffect} from 'react'
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace"
import {useDrawerProvider} from "../../Context/DrawerProvider"
import {useAuthProvider }  from "../../Context/AuthProvider"
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {IconButton} from "@material-ui/core"
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { RemoveStarredMessage } from '../../Utility'; 
import {getConversationId, GetChats,GetGroupMessages} from "../../Utility"
import "./StarredMessage.css"
import "../../Chat/Chat.css"
const StarredMessage = () => {
     const[messages,setMessages]=useState([]);
     const{userState,userDispatch,person,activeGroup,isPersonalChat,isGroupChat}=useAuthProvider()
     const{setLeftDrawer}=useDrawerProvider() 
     const [anchor, setAnchor] = useState(null);
     const[imageModelOpen,setImageModelOpen]=useState(false)


useEffect(()=>{

  fetch("http://localhost:8080/getstarmessage",{
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    method:"POST",
  })
    .then(res=>res.json())
    .then(result=>{
      setMessages(result.starredmessage)
    })

},[userState])



const handleExpand = (event) => {
    setAnchor(event.currentTarget);
    };
    
    const handleExpandClose = () => {
    setAnchor(null);
    };

    const  UnStarMessage=async(message)=>{
        const result= await RemoveStarredMessage (message);
        userDispatch({type:"REMOVESTARMESSAGE",  payload:result})
      
      }

    return (
        <div  className="starredmesage-body" >
            <p><IconButton onClick={()=>{setLeftDrawer("")}} >
                         <KeyboardBackspaceIcon />
                      </IconButton></p>
              <h3 style={{textAlign:"center",color:"#192a56"}}> Starred Message</h3>
             <hr/>
    
           {
            messages?.map(msg=>{
                   return(
                       <div>
                     
                       {
                           userState.starredmessage?.includes(msg._id) &&
                    
                        <p key={msg._id} className={msg.sender===userState._id?"chat-message chat-message-send":"chat-message chat-message-recieve"}>
                        {
                            msg.type==="text"?msg.message:

                            (msg.type==="image"?<img style={{cursor:"pointer"}} onClick={()=>{setImageModelOpen(true);}} className="chat-image" src={msg.message} alt ="pic"/>:

                             <audio controls src={msg.message}>  </audio>        
                           )
                        }
            
                        <ExpandMoreIcon
                               className="expand-icon"
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={(e) => {
                                  handleExpand(e);
                                  
                                }}
                                style={{ cursor: "pointer",color:"cadetblue" }}
                              />
                                <Menu
                                id="simple-menu"
                                anchorEl={anchor}
                                keepMounted
                                open={Boolean(anchor)}
                                onClose={handleExpandClose}
                               
                              >
                                
                                <MenuItem
                                  onClick={() => {
                                    handleExpandClose();  
                                     UnStarMessage(msg)
                                                                   
                                  }}
                                >
                                 Remove star
                                </MenuItem>
                                </Menu>
            
                        <span className="chat-timestamp">
                            {
                               new Date(msg.createdAt).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})
                            }
                        </span>
                        </p>


                       }
                       </div>
                   )
               })
           }
         
        </div>
    )
}

export default StarredMessage;

