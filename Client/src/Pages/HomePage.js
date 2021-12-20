import React,{useEffect} from 'react'
import Chat from "../components/Chat/Chat"
import GroupChat from '../components/GroupChat/GroupChat'
import NoChat from '../components/NoChat/NoChat'
import Sidebar from "../components/Sidebar/Sidebar"
import LeftDrawerPopup from '../components/LeftBar/LeftDrawer/LeftDrawerPopup'
import { useAuthProvider } from '../components/Context/AuthProvider'
import "./Pages.css"

const HomePage = () => {
    const{person,activeGroup,isPersonalChat,isGroupChat}=useAuthProvider()

    return (
        <div className="homepage">
        <div className="homepage_container">
            <div className="desktop_body">
                
                <Sidebar/>
                <LeftDrawerPopup/>

                {
                  isPersonalChat ?(person!==null?<Chat/>:<NoChat/>) :(activeGroup!==null?<GroupChat/>:<NoChat/>)
                }
               
            </div>
            <div className="mob_body">
             
               {               
                  isPersonalChat ?(person!==null?<Chat/>: <Sidebar/>) :(activeGroup!==null?<GroupChat/>: <Sidebar/>)
                }
              
                <LeftDrawerPopup/>
                
                
            </div>
            </div>
            
        </div>
    )
}

export default HomePage
