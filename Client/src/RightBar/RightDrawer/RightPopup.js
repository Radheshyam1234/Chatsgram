import React,{useState,useEffect} from 'react'
import "./RightPopup.css"
import SearchBox from '../SearchBox/SearchBox'
import ContactInfo from '../ContactInfo/ContactInfo'
import GroupInfo from '../GroupInfo/GroupInfo'
import {useDrawerProvider} from "../../components/Context/DrawerProvider"

const RightPopup = () => {
    const{ rightDrawer} = useDrawerProvider()
    const[component,setComponent]=useState("")

    useEffect(()=>{
        const item=()=>{
            switch(rightDrawer){
                case "SEARCH" :
                    return <SearchBox/>;
                case  "CONTACTINFO"  :
                    return <ContactInfo/>;
                case  "GROUPINFO"  :
                    return <GroupInfo/>;
                    default :
                    break;
            }
        }
        setComponent(item)

    },[rightDrawer])

    return (
        <div
           className="rightbar"
           style={{display: rightDrawer?"block":"none"}}
        >
            {component}
            
        </div>
    )
}

export default RightPopup
