import React,{useEffect,useState} from 'react'
import {useHistory }from "react-router-dom"
import{IconButton,Avatar} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { Person, Group} from '@material-ui/icons'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import SidebarChat from "../SidebarChat/SidebarChat"
import {useDrawerProvider} from "../Context/DrawerProvider"
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import {useAuthProvider }from "../Context/AuthProvider"
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { toast } from 'react-toastify';
import './Sidebar.css'

const Sidebar = () => {
    const history=useHistory()
    const{setLeftDrawer,setRightDrawer}=useDrawerProvider()
    const [anchor, setAnchor] = useState(null);
    const[groupName,setGroupName]=useState("");
    const[groupDescription,setGroupDescription]=useState("")
    const[createGroupModelOpen,setCreateGroupModelOpen]=useState(false)
    const{userState,users,groups,setGroups,setPerson,setActiveGroup,userDispatch,isPersonalChat,setIsPersonalChat,isGroupChat,setIsGroupChat} =useAuthProvider()
    // const [users, setUsers] = useState([])
    //const[groups,setGroups]=useState([])
    const[search,setSearch]=useState("")

const FilteredUsers=()=>{
    let ModifiedUsers=users;
    if (search) {
        ModifiedUsers = ModifiedUsers.filter((user) =>
         user.name.toLowerCase().includes(search)
        );
      }

      return ModifiedUsers;
}

const setConversation=(reciever)=>{
    fetch("http://localhost:8080/addconversation",{
        headers:{
          "content-Type":"application/json",
          // "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        method:"POST",
        body: JSON.stringify({
              senderid:userState._id,
              recieverid:reciever._id  
        })
        
      }).then(res=>res.json())
      .then(result=>{
          
      })

}
const handleClose=()=>{
    setAnchor(null)
}
const handleClick=(e)=>{
    setAnchor(e.currentTarget)
}

const AddGroup=(e)=>{
    e.preventDefault();
    setCreateGroupModelOpen(false)
    fetch("http://localhost:8080/creategroup",{
      headers:{
        "content-Type":"application/json",
      },
      method:"POST",
      body:JSON.stringify({
       name:groupName,
        description:groupDescription,
        createdBy:userState._id
      })
    }).then(res=>res.json())
    .then(result=>{
        toast.success("Group created successfully",{position:toast.POSITION.TOP_CENTER});
        setGroups(prev=>[result.message,...prev])

    })
    .catch(err=>{
        toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER});
    })
}

const LogOut=()=>{
    localStorage.clear()
          userDispatch({type:"LOGOUT"});
          history.push('/login')
         
}

    return (
        
        <div className="sidebar">
            <Modal open={createGroupModelOpen}  onClose={()=>{setCreateGroupModelOpen(false)}}  center >
                <form onSubmit={(e)=>{AddGroup(e)}}>
                    <label htmlFor="group-name"> <b>Group Name </b></label>
                    <input id="group-name" type="text" required
                    onChange={(e)=>{setGroupName(e.target.value)}}
                    />
                    <br/><br/>
                    <label htmlFor="group-description"> <b> Description </b> </label>
                    <input id="group-description" type="text" required
                     onChange={(e)=>{setGroupDescription(e.target.value)}}
                    />
                    <br/><br/>
                     <button className="create-group-button" type="submit">Create Group</button>
                </form>



          </Modal>
        {
            userState ?
            <>

            <div className="sidebar-header">
            <Avatar src={userState.profilephoto}
                onClick={()=>{setLeftDrawer("PROFILE")}}
                style={{cursor:"pointer"}}
            />
                <div className="sidebar-header-right">
                
                  <IconButton>
                  <MoreVertIcon
                   aria-controls="simple-menu"
                   aria-haspopup="true"
                   onClick={handleClick}/>
                  </IconButton>

                  <Menu
                id="simple-menu"
                anchorEl={anchor}
                keepMounted
                open={Boolean(anchor)}
                onClose={handleClose}
            >
                
                <MenuItem  onClick={()=>{setLeftDrawer("PROFILE");handleClose()}}>Profile</MenuItem>
                <MenuItem  onClick={() => {setLeftDrawer("STARREDMESSAGE");handleClose(); }} > Starred Messages </MenuItem>
                <MenuItem  onClick={()=>{setCreateGroupModelOpen(true);handleClose()}}>Create group</MenuItem>
                <MenuItem onClick={()=>{LogOut();handleClose()}}>LogOut</MenuItem>

                </Menu>
                </div>
            </div>

            </>
            :""
        }
          


            <div className="sidebar-search">
             <div className="sidebar-search-container">
             <SearchOutlinedIcon/>
                 <input type="text" placeholder=" Search or start new chat"
                   onChange={(e)=>{
                       setSearch(e.target.value);
                      
                   }}
                 />
            </div>
            </div>

            <div className="sidebar-chat-type">
                <div className="sidebar-chat-type-person" 
                    style={{
                        borderBottom:isPersonalChat?"4px solid red":"none",
                        color:isPersonalChat?"white":"#d1d8e0"
                    }}
                    onClick={()=>{ setIsPersonalChat(true) ;setIsGroupChat(false)}}
                >
               <span> <Person style={{fontSize:"32px"}}/></span>
                </div>

                <div className="sidebar-chat-type-group"
                 style={{
                     borderBottom:isGroupChat?"4px solid red":"none",
                     color:isGroupChat?"white":"#d1d8e0"
                }}
                 onClick={()=>{setIsGroupChat(true);setIsPersonalChat(false)}}
                >
                 <span>  <Group style={{fontSize:"32px"}}/> </span>
                </div>

            </div>

            <div className="sidebar-chat-name">
               {
                   users && userState && isPersonalChat? ( <>

                        { 
                            FilteredUsers().map(user=>{
                                
                                return(   <div key={user._id} onClick={()=>{
                                    setPerson(user);
                                    setConversation(user);
                                    }}>
                                            {
                                                user._id!==userState._id &&
                                    <SidebarChat
                                        user={user}
                                        group={null}
                                        key={user._id}  
                                           
                                        />
                                            }
                                        </div>
                                    )
                                } )
                               
                       }
                            </>
                   ):""
               }

               {
                   groups && userState && isGroupChat? ( <>

                        { 
                           groups.map(group=>{
                                
                                return(   <div key={group._id} 
                                     onClick={()=>{
                                        setActiveGroup(group);
                                     
                                    // setConversation(user);
                                     }}
                                    >
                                            {
                                               
                                    <SidebarChat
                                       group={group}
                                       user={null}
                                        key={group._id}  
                                           
                                        />
                                            }
                                        </div>
                                    )
                                } )
                               
                       }
                            </>
                   ):""
               }
                
            </div>
        </div>
    )
}

export default Sidebar
