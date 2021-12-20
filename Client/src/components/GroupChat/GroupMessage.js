import {React,useState,useEffect,useRef} from 'react'
import { useAuthProvider } from '../Context/AuthProvider'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "../Chat/Chat.css"
import { AddStarredMessage } from '../Utility';

const GroupMessage = ({message}) => {
    const{userState,userDispatch,person,setNewMessageFlag,socket,activeGroup,setDeletedGroupMessage}=useAuthProvider()
    const [anchor, setAnchor] = useState(null);
    const[imageModelOpen,setImageModelOpen]=useState(false)

const handleExpand = (event) => {
  setAnchor(event.currentTarget);
  };
  
const handleExpandClose = () => {
  setAnchor(null);
  };
  
const  StarMessage=async(message)=>{
    const result= await AddStarredMessage(message);
    userDispatch({type:"ADDSTARMESSAGE",  payload:result})
  
  }


  const DeleteMsg= (message)=>{

    socket.current.emit('deletegroupmessage',{
      senderId:userState._id,
     groupId:activeGroup._id,
      message,
    })
    
    fetch("http://localhost:8080/deletegroupmsg",{
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
    socket.current.on('removegroupmessage',data=>{  
      data.groupId===activeGroup._id &&  setDeletedGroupMessage(prev=>!prev)   ;
     
      })       
  },[])


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
                <p className={message.sender._id===userState?._id?"chat-message chat-message-send":"chat-message chat-message-recieve"}>
                  
                  <span style={{
                    position:"absolute",top:"-18px",color:"green",fontFamily:"sans-serif",fontSize:"small"
                  }}>{
                   message.sender._id!==userState?._id ? message.sender.name:"You"
                  }
                  </span>
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
                        
                       
                        {
                          message.sender._id===userState?._id && <MenuItem
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

export default GroupMessage
