import {React,useState,useEffect,useRef} from 'react'
import { useAuthProvider } from '../Context/AuthProvider'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./Chat.css"
import { AddStarredMessage } from '../Utility';

const Message = ({message}) => {
const{userState,userDispatch,person,setNewMessageFlag,socket,setDeletedMessage}=useAuthProvider()
const [anchor, setAnchor] = useState(null);
const[imageModelOpen,setImageModelOpen]=useState(false)

const handleExpand = (event) => {
setAnchor(event.currentTarget);
};

const handleExpandClose = () => {
setAnchor(null);
};


const DeleteMsg= (message)=>{

  socket.current.emit('deletemessage',{
    senderId:userState._id,
    recieverId:person._id,
    message,
  })
  
  fetch("http://localhost:8080/deletemsg",{
    method:"POST",
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
        
    },
    body:JSON.stringify({
      messageId:message._id
    })
    }).then(res=>res.json())
    .then(data=>{
      setNewMessageFlag(prev=>!prev);
    
     
    })
    .catch(err=>{console.log(err)})
 
}

useEffect(()=>{
  socket.current.on('removemessage',data=>{  
    data.senderId===person._id &&  setDeletedMessage(data.message)   
    })       
},[])

const  StarMessage=async(message)=>{
   
  if (! userState.starredmessage?.includes(message._id))
  {
    const result= await AddStarredMessage(message);
  console.log(message)
  userDispatch({type:"ADDSTARMESSAGE",  payload:result})
}

}

    return (
       
      <>

      <Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >

                  <img 
                  style={{width:"100%",}}
                   src={message.message} 
                   alt="loading"
                   /><  br/>
         </Modal>
      
        
      
              {
                  <p className={message.sender===userState?._id?"chat-message chat-message-send":"chat-message chat-message-recieve"}>
                  {
                      message.type==="text"?message.message:
                      (message.type==="image"?<img style={{cursor:"pointer"}} onClick={()=>{setImageModelOpen(true);}} className="chat-image" src={message.message} alt ="pic"/>:
                       <audio controls src={message.message}>
      
                      </audio>)
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
                              StarMessage(message)
                            }}
                          >
                            Star Message
                          </MenuItem>
                          {
                            message.sender===userState?._id && <MenuItem
                            onClick={() => {
                                DeleteMsg(message)
                              handleExpandClose();
                             
                            }}
                          >
                            Delete Message
                          </MenuItem>
                          }
                         
                        </Menu>
                      
      
      
      
                  <span className="chat-timestamp">
                      {
                         new Date(message.createdAt ).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})
                      }
                  </span>
                  </p>
              }
              </>

    )



    
}

export default Message


