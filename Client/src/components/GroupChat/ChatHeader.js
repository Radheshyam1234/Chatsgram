import React,{useState,useEffect} from 'react'
import { Avatar,IconButton,Button } from '@material-ui/core'
import { ArrowBackIos,Send, InsertEmoticon, MoreVert,SearchOutlined,CloseOutlined, ContactSupportOutlined,} from 
"@material-ui/icons"
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useDrawerProvider } from '../Context/DrawerProvider';
import { useAuthProvider } from '../Context/AuthProvider'
import {BsImages} from "react-icons/bs"
import Modal from 'react-modal'
import { postImage } from '../Utility'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatHeader = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const{rightDrawer,setRightDrawer}=useDrawerProvider()
    const{userState,person,setPerson,activeGroup,setActiveGroup,isPersonalChat,activeUsers,setNewMessageFlag}=useAuthProvider();
    const [image, setImage] = useState(null);
    const[imageurl,setImageurl]=useState("")
    const[imageModelOpen,setImageModelOpen]=useState(false)


    useEffect(()=>{
        if(image){
             setImageModelOpen(true)      
        }
    },[image])
   
    useEffect(()=>{
       if(imageurl){
      sendMessage("image")
    console.log(imageurl)
       }
   },[imageurl])
   
   const sendMessage=(type)=>{
        var Message="";
  
  if(type==="image"){
      Message=imageurl;
  }

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

    return ( <>
        <div className="chat-header">
            
            <IconButton onClick={()=>{isPersonalChat?setPerson(null):setActiveGroup(null)}}>
                      <ArrowBackIos />
                    </IconButton>
                
                    <Avatar 
                    style={{cursor:"pointer"}}
                    src={isPersonalChat ? (person &&person.profilephoto):(activeGroup.profilephoto)}
                     onClick={()=>{setRightDrawer( isPersonalChat?"CONTACTINFO":"GROUPINFO")}}
                     />

                    <div className="chat-header-info">

                        <h3>{isPersonalChat ? (person &&person.name):(activeGroup.name)}</h3>

                  {   isPersonalChat && <p>{activeUsers?.find(user => user.userId === person._id) ? <b className="online-status">Online</b> : <b className="offline-status">Offline</b>}</p>}
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
                        setRightDrawer(isPersonalChat?"CONTACTINFO":"GROUPINFO");
                          handleClose();
                        }}
                      >
                      {isPersonalChat?" Contact Info" : "Group Info"}
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
        </>
    )
}

export default ChatHeader
