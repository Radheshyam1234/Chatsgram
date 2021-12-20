import React,{useState,useEffect} from 'react'
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace"
import {IconButton} from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"
import {useDrawerProvider} from "../../components/Context/DrawerProvider"
import {useAuthProvider }  from "../../components/Context/AuthProvider"
import {getConversationId, GetChats, GetGroupMessages} from "../../components/Utility"
import "./SearchBox.css"
const SearchBox = () => {

  const{userState,person,activeGroup,isPersonalChat,isGroupChat}=useAuthProvider()
  const [search,setSearch]=useState("");
  const[messages,setMessages]=useState([])
  const[result,setResult]=useState([]);
  const{setRightDrawer}=useDrawerProvider()

  const getData=async()=>{
    const data=await getConversationId(userState._id,person._id)
    const message= await GetChats(data.data._id)
   setMessages(message.messages)
  }
  const getGroupData=async()=>{
    const groupmessage=await GetGroupMessages(activeGroup._id);
    setMessages(groupmessage.messages)

  }

  useEffect(async ()=>{
    if(isPersonalChat&& person){ await getData();}
    else if(isGroupChat&& activeGroup){ getGroupData();}
    
    {
      search
        ? setResult(
            messages.filter((item) =>
              item.message
                ?.toUpperCase()
                .includes(search.toUpperCase())
            )
          )
        : setResult([]);
    }

    return ()=>{}
  },[search,messages])

    return (
        <div className="searchbox">
         <div className='searchbox-header'>
           <IconButton onClick={()=>{setRightDrawer("")}} >
         <KeyboardBackspaceIcon />
         </IconButton>
         </div>
            
         <div className="searchbox__searchbar">
        <div className="searchbox_container">
          {search ? (
            <IconButton>
              <ClearIcon onClick={() => setSearch("")} />
            </IconButton>
          ) : (
            <IconButton>
              <SearchIcon />
            </IconButton>
          )}
          <input
            className="search__input"
            type="text"
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a chat"
          />
        </div>
      </div>

      <div className="searchbox__body">
        {
          result&& result.map(message=>{
            return(
              <>
                { message.type==="text" &&
  
                    <p className={(isGroupChat?message.sender._id: message.sender)===userState._id?"chat-message chat-message-send":"chat-message chat-message-recieve"}>
                    {
                      message.message

                    }

                    <   span className="chat-timestamp">
                      { 
                          new Date(message.createdAt ).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})
                      }
                    </span>

                    </p>

                }
        

              </>
            )
          })
        }
     
      </div>

            
        </div>
    )
}

export default SearchBox
