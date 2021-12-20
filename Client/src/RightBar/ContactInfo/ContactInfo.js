import React,{useEffect,useState} from 'react'
import { Avatar} from '@material-ui/core'
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace"
import {IconButton} from "@material-ui/core"
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {useDrawerProvider} from "../../components/Context/DrawerProvider"
import {useAuthProvider }  from "../../components/Context/AuthProvider"
import {getConversationId, GetChats} from "../../components/Utility"
import "./ContactInfo.css"


const ContactInfo = () => {
    const{setRightDrawer}=useDrawerProvider()
    const{userState,person}=useAuthProvider()
    const[imageModelOpen,setImageModelOpen]=useState(false)
    const[imageModelSrc,setImageModelSrc]=useState("")
    const[messages,setMessages]=useState([])
   
    useEffect(()=>{

        const getData=async()=>{
            const data=await getConversationId(userState._id,person._id)
            const message= await GetChats(data.data._id)
           setMessages(message.messages)
          }
        getData();
       
        return()=>{setMessages()}
    
    },[userState,person])
    


    return (
        <div  className="contact-info">

              <Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >
                    <img  style={{width:"100%"}}
                    src={imageModelSrc} alt="loading"/><br/>
            </Modal>

        <div className="contact-info-header">
        <IconButton onClick={()=>{setRightDrawer("")}} >
         <KeyboardBackspaceIcon />
         </IconButton>
        </div>

        <div className="contact-profile-pic">
        <Avatar 
                   src={person.profilephoto}
                   style={{height:"170px", width:"170px"}}
                   aria-controls="simple-menu"
                   aria-haspopup="true"
                   onClick={()=>{setImageModelSrc(person.profilephoto);setImageModelOpen(true)}}
               />
        </div>
        <h4 className="contact-user-name">{person.name}</h4>

        <div className="contact-user-info">
            
            <div className="contact-user-about-info">
                <p style={{color:"#3ae374"}}><b>About and email</b></p>
                <p>{person.about}</p>
                <hr/>
                <p style={{color:"#B33771"}}>{person.email}</p>
            </div>

        </div>
        
        <div className="contact-user-info">
            <div contact-user-joined-info>
                <p>Joined on</p>
                <p style={{color:"brown"}}> {((new Date(person.joinedOn)).toString())}</p>
            </div>
        </div>

        <div className="shared-media">
            <p style={{color:"#3ae374",padding:"10px"}}><b> Shared media</b></p>
            <div className="gallery">
               {
                   messages?.map(message=>{
                       if(message.type=="image"){
                           return(
                               <img 
                               style={{cursor:"pointer"}}
                               src={message.message} 
                               alt="loading"
                               onClick={()=>{setImageModelSrc(message.message);setImageModelOpen(true)}}
                               />
                           )
                       }
                   })
               }
            </div>
        </div>

        
        </div>
    )
}

export default ContactInfo
