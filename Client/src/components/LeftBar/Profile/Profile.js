import React,{useState,useEffect} from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { CheckOutlined, Edit, KeyboardBackspaceTwoTone } from '@material-ui/icons'
import {useDrawerProvider} from "../../Context/DrawerProvider"
import { useAuthProvider } from '../../Context/AuthProvider'
import { MenuItem } from '@material-ui/core'
import { Menu } from '@material-ui/core'
import {toast} from 'react-toastify'
import {postImage} from "../../Utility"
import {editBio,editProfileName} from "../../Utility"
import "./Profile.css"
toast.configure()

const Profile = () => {
    const{setLeftDrawer}=useDrawerProvider()
    const{userState,userDispatch}=useAuthProvider()
    const[anchorEl,setAnchorEl] =useState(null);
    const[imageModelOpen,setImageModelOpen]=useState(false)
    const [nameInputDisabled,setNameInputDisabled]=useState(true);
    const [bioInputDisabled,setBioInputDisabled]=useState(true);
    const[name,setName]=useState("");
    const [bio,setBio]=useState("")
    const[imageurl,setImageurl]=useState("")

    useEffect(()=>{
        setName(userState.name);
        setBio(userState.about)
    },[])

    useEffect(()=>{
  if(imageurl){
    fetch("http://localhost:8080/profilepic",{
        method:"POST",
        headers:{
            "content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
            
        },
        body:JSON.stringify({
            url:imageurl
        })
        }).then(res=>res.json())
        .then(data=>{
            userDispatch({type:"UpdatedProfilePic",payload:{profilephoto:data.profilephoto}})
            toast.success("Profile picture updated",{position:toast.POSITION.TOP_CENTER})
        })
   
  }
    },[imageurl])


    const handleClose=()=>{
        setAnchorEl(null)
    }
    const handleClick=(e)=>{
        setAnchorEl(e.currentTarget)
    }

const changeProfilePic= async (e)=>{
    e.preventDefault();
    const data= await postImage(e.target.files[0]);
    if(data){
        setImageurl(data.url);
        toast.success("Profile picture updated",{position:toast.POSITION.TOP_CENTER})   
    }
   else{
    toast.error("Please Try again",{position:toast.POSITION.TOP_CENTER})   
   }                 
}

 const editName=async()=>{
  
   const data= await editProfileName(name);
   if(data){
    userDispatch({type:"UpdatedProfileName",payload:{profilename:data.name}})
    toast.success("User name Saved",{position:toast.POSITION.TOP_CENTER})     
   }
   else{
    toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER}) 
   }
   
    }

 const EditBio= async()=>{
     const data=await editBio(bio);
     if(data){
        userDispatch({type:"UpdatedBio",payload:{about:data.about}})
        toast.success("About  Saved",{position:toast.POSITION.TOP_CENTER})
     }
     else{
        toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
     }
    
 }


const removeProfilePic=()=>{
    fetch("http://localhost:8080/removepic",{
        method:"POST",
        headers:{
            "content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
            
        },
        }).then(res=>res.json())
        .then(data=>{
            userDispatch({type:"UpdatedProfilePic",payload:{profilephoto:data.profilephoto}})
        })
        .catch(err=>{
            toast.error("Some error occured",{position:toast.POSITION.TOP_CENTER})

        })
}

    return (
        <div className="profile">

<Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >
<img  style={{width:"100%"}}
src={userState.profilephoto} alt="loading"/><br/>
 </Modal>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <form>
                    <label>
                        <input style={{display:"none"}} onChange={(e)=>{changeProfilePic(e)}} className="profile-image-input" type="file"/>
                    <MenuItem onClick={handleClose}>Change Photo</MenuItem>
                    </label> 
                    </form> 
                    <MenuItem onClick={()=>{setImageModelOpen(true);handleClose()}}>View Photo</MenuItem>
                <MenuItem onClick={()=>{removeProfilePic();handleClose()}}>Remove photo</MenuItem>
                
                </Menu>
           <div className="profile-header">
               <IconButton
                 onClick={()=>{setLeftDrawer("")}}>
                   <KeyboardBackspaceTwoTone  />
               </IconButton>
               <h3>Profile</h3>
           </div>

           <div className="profile-pic">
               <Avatar 
                   src={userState.profilephoto}
                   style={{height:"170px", width:"170px"}}
                   aria-controls="simple-menu"
                   aria-haspopup="true"
                   onClick={handleClick}
               />
           </div>

           <div className="profile-information">
            {/* <div className="profile-info-name"> {userState.name} </div> */}

            <div className="profile-info-name">Your name </div>
            <div className="profile-info-edit">
               <input type="text"
                value={name}
               onChange={(e)=>setName(e.target.value)}
                disabled={nameInputDisabled}
                style={{borderBottom:nameInputDisabled?"none":"1px solid #e056fd"}}
               ></input>
               {
                   nameInputDisabled? (
                       <IconButton onClick={()=>{setNameInputDisabled(false)}}>
                           <Edit/>
                       </IconButton>

                   ):(
                       <IconButton 
                       onClick={()=>{setNameInputDisabled(true)
                        editName()}} >

                        <CheckOutlined/>
                       
                       </IconButton>
                      

                   )
               }
               </div>
              {/* style={{borderBottom:"1px solid #00BFA5"}}  */}
              <hr/>
              <div className="profile-info-about">About </div>

              <div className="profile-info-edit">
               <input type="text"
                value={bio}
               onChange={(e)=>setBio(e.target.value)}
                disabled={bioInputDisabled}
                style={{borderBottom:bioInputDisabled?"none":"1px solid #e056fd"}}
               ></input>
               {
                   bioInputDisabled? (
                       <IconButton onClick={()=>{setBioInputDisabled(false)}}>
                           <Edit/>
                       </IconButton>

                   ):(
                       <IconButton 
                       onClick={()=>{setBioInputDisabled(true)
                        EditBio()}} >

                        <CheckOutlined/>
                       
                       </IconButton>
                      

                   )
               }
               </div>
           </div>
           <p style={{color:"brown"}}>Joined on {((new Date(userState.joinedOn)).toString())}</p>

        </div>
    )
}

export default Profile
