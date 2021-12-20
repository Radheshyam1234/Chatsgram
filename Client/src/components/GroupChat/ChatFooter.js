import React,{useState,useEffect} from 'react'
import { Avatar,IconButton,Button } from '@material-ui/core'
import {Mic , MicOff} from "@material-ui/icons";
import { ReactMic } from "react-mic";
import Picker from "emoji-picker-react"
import { CloseOutlined, InsertEmoticon,Send } from '@material-ui/icons';
import { useAuthProvider } from '../Context/AuthProvider'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Chat/Chat.css"
import { Socket } from 'socket.io-client';
toast.configure()

const ChatFooter = () => {
    const{userState,setNewMessageFlag,activeGroup,socket}=useAuthProvider()
const[input,setInput] =useState("");
const[emojiOpen,setEmojiOpen]=useState(false)
const [record, setRecord] = useState(false);
const [audioSrc, setAudioSrc] = useState();
const [voiceString, setVoiceString] = useState("");

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

  const onEmojiClick=(e,emojiObject)=>{
        setInput(input+emojiObject.emoji)
    }

    const sendMessage=(type)=>{
        var Message="";
  
  if(type==="text"){Message=input}
  
  else if(type==="audio"){Message=audioSrc}
  
  socket.current.emit('groupmessage',{
    senderId:userState._id,
    groupId:activeGroup._id,
    text:Message,
    type:type
  })
  

     fetch("http://localhost:8080/addgroupmessage",{
          headers:{
            "content-Type":"application/json",
          },
       method:"POST",
          body: JSON.stringify({
                 groupId:activeGroup._id,
                 sender:userState._id,
                 message:Message,
                 type:type
               
       }) 
  
         }).then(res=>res.json())
         .then(data=>{
             console.log(data)
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
         </>
    )
}

export default ChatFooter
