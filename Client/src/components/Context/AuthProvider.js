import React ,{useState,useEffect,useContext,createContext,useReducer,useRef} from 'react'
import {io} from "socket.io-client"
import {userReducer,initialState} from "./Reducer"
const AuthContext=createContext();

export const AuthProvider=({children})=>{

    const[userState,userDispatch]=useReducer(userReducer,initialState);
    const[person,setPerson]=useState(null);
    const[activeGroup,setActiveGroup]=useState(null)
    const [activeUsers, setActiveUsers] = useState([]);
    const[users,setUsers]=useState([])
    const[newMessageFlag,setNewMessageFlag]=useState(false)
    const[deletedMessageFlag,setDeletedMessageFlag]=useState(false)
    const[deletedmessage,setDeletedMessage]=useState(null);
    const[deletedGroupMessage,setDeletedGroupMessage]=useState()
    const[isPersonalChat,setIsPersonalChat]=useState(true)
    const[isGroupChat,setIsGroupChat]=useState(false)
    const[groups,setGroups]=useState([])
    const socket=useRef();

    // useEffect(() => {
    //    socket.current=io("ws://localhost:9000");
     
    // }, [])

    useEffect(()=>{
      socket.current=io("http://localhost:8080") ;
    },[])
   
    // useEffect(()=>{
    //   socket.current=io("https://chattapp11.herokuapp.com/") ;
    // },[])


   useEffect(()=>{
    fetch("http://localhost:8080/groups",{
        headers:{
          "content-Type":"application/json",
        },
        method:"GET",
        
      }).then(res=>res.json())
      .then(result=>{
         setGroups(result.groupss)
        
      })
   },[])
   
   useEffect(()=>{
    fetch("http://localhost:8080/users",{
  headers:{
    "content-Type":"application/json",
  },
  method:"GET",
  
}).then(res=>res.json())
.then(result=>{
   setUsers(result.users)
   //console.log(person)
})
  },[])


    return(
        <AuthContext.Provider value={{
            userState,userDispatch,
            person,setPerson,
            users,setUsers,
            groups,setGroups,
            activeGroup,setActiveGroup,
            isPersonalChat,setIsPersonalChat,
            isGroupChat,setIsGroupChat,
            socket,
            activeUsers,
            setActiveUsers,
            newMessageFlag,
            setNewMessageFlag,
            deletedMessageFlag,
            setDeletedMessageFlag,
            deletedmessage,
            setDeletedMessage,
            deletedGroupMessage,setDeletedGroupMessage
            }}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuthProvider=()=>{
    return  useContext(AuthContext)
    
}