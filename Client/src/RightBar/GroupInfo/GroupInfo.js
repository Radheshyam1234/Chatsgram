import React,{useEffect,useState} from 'react'
import { Avatar} from '@material-ui/core'
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace"
import {IconButton} from "@material-ui/core"
import { CameraAlt } from '@material-ui/icons'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {useDrawerProvider} from "../../components/Context/DrawerProvider"
import {useAuthProvider }  from "../../components/Context/AuthProvider"
import { SaveGroupInfo,postImage } from '../../components/Utility';
import {toast} from 'react-toastify'
import "./GroupInfo.css"
toast.configure()

const GroupInfo = () => {
    const{setRightDrawer}=useDrawerProvider()
    const[groupName,setGroupName]=useState("");
    const[description,setDescription]=useState("")
    const{userState,groups,setGroups,userDispatch,activeGroup,setActiveGroup}=useAuthProvider()
    const[imageModelOpen,setImageModelOpen]=useState(false)
    const[editModelOpen,setEditModelOpen]=useState(false);
    const[imageUrl,setImageUrl]=useState("")
    const[imageModelSrc,setImageModelSrc]=useState("")

    const editGroupInfo=async()=>{
       const data=await SaveGroupInfo(activeGroup._id,groupName,description)
       if(data){
        toast.success("Group Info edited successfully",{position:toast.POSITION.TOP_CENTER});
         setActiveGroup(data);
        const newGroups= groups.map(group=>{
            if(group._id===data._id) return data;
            else return group;
        })
        
        setGroups(newGroups)
        
       }
       else{
        toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
       }
       
        }

  useEffect(()=>{
   setGroupName(activeGroup.name);
   setDescription(activeGroup.description)
  },[])
  
  useEffect(()=>{
    if(imageUrl){
      fetch("http://localhost:8080/groupprofilepic",{
          method:"POST",
          headers:{
              "content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
              
          },
          body:JSON.stringify({
              groupId:activeGroup._id,
              url:imageUrl
          })
          }).then(res=>res.json())
          .then(data=>{
            toast.success("Profile picture updated",{position:toast.POSITION.TOP_CENTER})
            setActiveGroup(data);
            const newGroups= groups.map(group=>{
                if(group._id===data._id) return data;
                else return group;
            })
            
              setGroups(newGroups)
            
          })
     
    }
      },[imageUrl])

  const changeGroupPhoto=async(e)=>{
    const data= await postImage(e.target.files[0]);
    if(data){
        setImageUrl(data.url);
    }
   else{
    toast.error("Please Try again",{position:toast.POSITION.TOP_CENTER})   
   }       
  }
  

    return (
        <div className="group-info">

             <Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >
                    <img  style={{width:"100%"}}
                    src={imageModelSrc} alt="loading"/><br/>
            </Modal> 


           <div className="group-info-header">
        <IconButton onClick={()=>{setRightDrawer("")}} >
         <KeyboardBackspaceIcon />
         </IconButton>
        </div>


        <div className="group-profile-pic">
        <Avatar 
                   src={activeGroup.profilephoto}
                   style={{height:"170px", width:"170px"}}
                   aria-controls="simple-menu"
                   aria-haspopup="true"
                   onClick={()=>{setImageModelSrc(activeGroup.profilephoto);setImageModelOpen(true)}}
       />
               
          { activeGroup.createdBy._id==userState._id &&<>
           <label htmlFor="change-profile-pic"> 
            <CameraAlt style={{color:"blue",cursor:"pointer"}}/>
            </label>
            <input style=
            {{display:"none"}} 
            type="file" id="change-profile-pic"
            onChange={(e)=>{changeGroupPhoto(e)}}
            />
            </>
            }
           
        </div>
 
        <Modal open={editModelOpen}  onClose={()=>{setEditModelOpen(false)}}  center >
                  
        <div className="group-info container">
         <form onSubmit={(e)=>{e.preventDefault();editGroupInfo();setEditModelOpen(false)}}>

            <label htmlFor="fname">Group Name</label>
            <input type="text" id="fname"
             value={groupName} 
             onChange={(e)=>{setGroupName(e.target.value)}}
             />

            <label htmlFor="lname">Group Description</label>
            <input type="text" id="lname"
             value={description}
             onChange={(e)=>{setDescription(e.target.value)}}
             />

            <input type="submit" value="Save"/>
        </form>
</div>

            </Modal>

      <div className="group-details">
          <div className="group-name">
              <span className="group-name-heading">Group Name</span>
              <p>{activeGroup.name}</p>
              <hr/>
          </div>
         
          <div className="group-description">
          <span className="group-description-heading">Description</span>
              <p>{activeGroup.description}</p>
              <hr/>
          </div>
          {(activeGroup.createdBy._id)==userState._id && <button onClick={()=>{setEditModelOpen(true)}} className="edit-btn">Edit</button>}
          </div>
             <br/>
           
          <div className="group-details">
          <div className="group-creation">
            <span className="group-creation-heading">Created At </span> 
            <p> {((new Date(activeGroup.createdAt)).toString())} </p>

            
    </div>

      <div className="group-creation">
            <span className="group-creation-heading">Created By </span> 
            <p style={{color:"crimson"}}> {activeGroup.createdBy._id==userState._id?"You":activeGroup.createdBy.name} </p>
            
            
    </div>
    </div>

     

     

        </div>
    )
}

export default GroupInfo
