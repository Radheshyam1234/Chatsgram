import React,{useEffect,useState} from 'react'
import Profile from "../Profile/Profile"
import StarredMessage from '../Starred/StarredMessage'
import{useDrawerProvider} from "../../Context/DrawerProvider"
import "./LeftDrawer.css"

const LeftDrawerPopup = () => {
 const [component,setComponent]=useState("")
 const{leftDrawer} =useDrawerProvider()

 useEffect(()=>{
    
const item=()=>{
    switch(leftDrawer){
        case "PROFILE" :
            return <Profile/>
            case "STARREDMESSAGE" :
                return <StarredMessage/>;
            default :
            break;
    }
}

  setComponent(item)
 
 },[leftDrawer])

    return (
        <div className="left" style={{left: leftDrawer ? "0px" : "-800px"}}>
        {
            component
        }
            
        </div>
    )
}

export default LeftDrawerPopup
