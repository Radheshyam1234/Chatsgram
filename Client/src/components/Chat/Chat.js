import React,{useState,useEffect,useRef} from 'react'
import moment from "moment"
import { Avatar,IconButton,Button } from '@material-ui/core'
import { ArrowBackIos,Send, InsertEmoticon, MoreVert,SearchOutlined,CloseOutlined, ContactSupportOutlined,} from 
"@material-ui/icons"
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useDrawerProvider } from '../Context/DrawerProvider';
import { GetChats } from '../Utility'
import {Mic , MicOff} from "@material-ui/icons"
import {BsImages} from "react-icons/bs"
import Modal from 'react-modal'
import { ReactMic } from "react-mic";
import Picker from "emoji-picker-react"
import { useAuthProvider } from '../Context/AuthProvider'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Message from './Message'
import {postImage} from "../Utility"
import RightPopup from "../../RightBar/RightDrawer/RightPopup"
import './Chat.css'
toast.configure()


const Chat = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const{rightDrawer,setRightDrawer}=useDrawerProvider()
    const[input,setInput] =useState("");
    const scrollRef=useRef(null);
    const[chat,setChat]=useState([])
    const [conversationId, setConversationId] = useState({})
    const{userState,person,setPerson,socket,activeUsers,setActiveUsers,newMessageFlag,setNewMessageFlag,deletedmessage}=useAuthProvider();
    const[incomingMessage,setIncomingMessage]=useState(null)
    const [image, setImage] = useState(null);
    const[imageurl,setImageurl]=useState("")
    const[imageModelOpen,setImageModelOpen]=useState(false)
    const[emojiOpen,setEmojiOpen]=useState(false)
    const [record, setRecord] = useState(false);
    const [audioSrc, setAudioSrc] = useState();
    const [voiceString, setVoiceString] = useState("");

    useEffect(()=>{
       
        fetch("http://localhost:8080/getconversation",{
        headers:{
          "content-Type":"application/json",
        },
        method:"POST",
        body: JSON.stringify({
              sender:userState._id,
              reciever:person._id  
        })  
      }).then(res=>res.json())
    .then(async(data)=>{
         // console.log(data.data._id)
          setConversationId(data.data._id);
          const result= await GetChats(data.data._id)
          setChat(result.messages)
 })
    
   .catch(err=>{console.log(err)})
      return ()=>{}

    },[person._id,newMessageFlag,deletedmessage,incomingMessage])

    useEffect(()=>{
      scrollRef.current?.scrollIntoView({transition:'smooth'})
    },[chat,incomingMessage,newMessageFlag])
    
    useEffect(()=>{
      socket.current.on('getMessage',data=>{
        var date=moment.utc().format()
        setIncomingMessage({
          sender:data.senderId,
          message:data.text,
          type:data.type,
          createdAt:date

        })
      })

    },[])
    
    // useEffect(()=>{
    //   incomingMessage &&incomingMessage.sender===person._id && setChat(prev=>[...prev,incomingMessage])
    // },[incomingMessage])


    useEffect(()=>{
     socket.current.emit('addUser',userState._id);
     socket.current.on('getUsers',users=>{
        setActiveUsers(users) 
     })

   
  },[userState])


 useEffect(()=>{
     if(image){
          setImageModelOpen(true)      
     }
 },[image])

 useEffect(()=>{
    if(imageurl){
    sendMessage("image")
    }
},[imageurl])


 useEffect(()=>{
    if(voiceString.length){
      
        var fd = new FormData();
    
        fd.append("file", `data:audio/webm;base64,${voiceString}`);
    
        fd.append("upload_preset", "chat-app");
        fd.append("cloud_name", "radheshyam11");
        fd.append("resource_type", "video");
    
        fetch("https://api.cloudinary.com/v1_1/radheshyam11/upload", {
          method: "POST",
          body: fd
        })
          .then((res) => res.json())
          .then( (data) => {
             console.log(data.url);
             setAudioSrc(data.url)
            setVoiceString("")
          
          })
          .catch((err) => {
            console.log(err);
          });
      }
    
    },[voiceString])


useEffect(()=>{
  if(audioSrc){
      console.log(audioSrc)
      sendMessage("audio")
  }
},[audioSrc])

const handleClose = () => {
  setAnchorEl(null);
};
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};

const UploadImage= async ()=>{

try{
  const data=await postImage(image);
setImage(null);
setImageModelOpen(false);
setImageurl(data.url)
} 
catch(err){
  toast.error("Some error occured ",{position:toast.POSITION.TOP_CENTER})
  console.log(err)
}}


    const onEmojiClick=(e,emojiObject)=>{
        setInput(input+emojiObject.emoji)
    }

  const sendMessage=(type)=>{
      var Message="";

if(type==="image"){
    Message=imageurl;
}
else if(type==="text"){Message=input}

else if(type==="audio"){Message=audioSrc}

socket.current.emit('sendmessage',{
  senderId:userState._id,
  recieverId:person._id,
  text:Message,
  type:type
})

   fetch("http://localhost:8080/addmessage",{
        headers:{
          "content-Type":"application/json",
        },
     method:"POST",
        body: JSON.stringify({
             conversationId : conversationId,
               sender:userState._id,
               message:Message,
               type:type
             
     }) 

       }).then(res=>res.json())
       .then(data=>{
           if (data.error){
            toast.error("Some issues occured please try again",{position:toast.POSITION.TOP_CENTER})
           }  
       })
       .catch(err=>{      
        
         console.log(err)
       })

     setNewMessageFlag(prev=>!prev)  
}


  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
   
  };

  const onData = (recordedBlob) => {
  };

  const onStop =   (recordedBlob) => {
  

      const url = URL.createObjectURL(recordedBlob.blob);
   
    var reader = new FileReader();
    reader.readAsDataURL(recordedBlob.blob);

    reader.onloadend = function () {
      const base64data = reader.result;
      let str = base64data;
      
     setVoiceString(str.replace("data:audio/webm;codecs=opus;base64,", ""));
    };
    }




    return (
      <>
        <div className="chat">

                  
                <div className="chat-header">
                
                    <IconButton onClick={()=>{setPerson(null)}}>
                      <ArrowBackIos />
                    </IconButton>
                
                    <Avatar 
                    style={{cursor:"pointer"}}
                    src={person && person.profilephoto}
                     onClick={()=>{setRightDrawer("CONTACTINFO")}}
                     />

                    <div className="chat-header-info">
                        <h3>{person && person.name}</h3>
                        <p>{activeUsers?.find(user => user.userId === person._id) ? <b className="online-status">Online</b> : <b className="offline-status">Offline</b>}</p>
                    </div>
                    <div className="chat-header-right">

                        <IconButton  onClick={()=>{setRightDrawer("SEARCH")}}>
                            <SearchOutlined  />
                        </IconButton>

                        

                        <label htmlFor="fileUpload">
                            <div>
                                
                              <BsImages style={{fontSize:"24px",color:"brown",cursor:"pointer"}}/>
                            
                            </div>
                        </label>
              <input hidden id="fileUpload" type="file" accept="image/*" 
              onChange={(e=>{setImage(e.target.files[0])
              })}
              
              />
                        <IconButton>
                            <MoreVert  aria-controls="simple-menu" aria-haspopup="true"  onClick={handleClick}/>
                            
                            <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                        setRightDrawer("CONTACTINFO");
                          handleClose();
                        }}
                      >
                       Contact Info
                      </MenuItem>
                     
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          setRightDrawer("SEARCH")
                          // handleClearMessages();
                        }}
                      >
                      Search
                      </MenuItem>
                    </Menu>
                      
                        </IconButton>
                    </div>
                </div>

         <Modal isOpen={imageModelOpen}  onRequestClose={()=>{setImageModelOpen(false);}}   ariaHideApp={false}
            style={{
                content:{
                    top: '30%',
                    left: '45%',
                    right: '40%',
                    bottom: '30%',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor:"#f3a683"
                },
               
            }}
         >
            <h2 style={{color:"white"}}>Send Image</h2>
            <p>{image&&image.name}</p>
            <Button variant="contained" onClick={()=>{UploadImage()}}>Send</Button>
            <Button color="secondary"  onClick={()=>{setImageModelOpen(false);}}>Cancel</Button>
        </Modal>

           
         <div className="chat-body" >

         {
                chat?<>
                {
                    chat.map(message=>{
                        return(
                            < div key={message._id} ref={scrollRef}>
                            <Message 
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

         <div className="chatbox_emoji" style={emojiOpen?{height:"250px"}:{height:"0px",width:"0%"}}>

<Picker
    disabledSearchBar
    disableSkinTonePicker
    onEmojiClick={onEmojiClick}
    pickerStyle={{width:"100%"}}
/>
</div>

         <div className="chat-footer">
         
         
          {
              emojiOpen && (
                  <IconButton onClick={()=>{setEmojiOpen(false)}}>
                   <CloseOutlined/>
                  </IconButton>

              )
          }
          <IconButton
          onClick={()=>{setEmojiOpen(true)}}>
               <InsertEmoticon
                   style={emojiOpen?{color:"#047857"}:{color:"inherit"}}
               />
          </IconButton>
            
             <form>
                 <input type="text"
                 placeholder="Type a message.."
                 value={input}
                     onChange={(e)=>{setInput(e.target.value)}}
                  
                     
                 />
                 {
                     input?<Send style={{color:"#be2edd"}}
                         onClick={()=>{sendMessage("text");setInput("")}}
                     />
                     :
                     <Send />
                 }
                
             </form>
             <ReactMic
        record={record}
        onStop={onStop}
        onData={onData}
        className="sound-wave"
        echoCancellation="true"
        channelCount="2"
      />
      {
        record?
        <Mic  style={{cursor:"pointer",color:"red",fontSize:"20px"}} onClick={ ()=>{
          stopRecording();
         
        }}/>
        :
        <MicOff  style={{cursor:"pointer",color:"green"}}onClick={startRecording}/>
      }
      
         </div>
        </div>
        <RightPopup/>
        </>
    )
}

export default Chat
