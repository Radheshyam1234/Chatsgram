import React,{useEffect} from 'react'
import { useHistory } from 'react-router'
import { useAuthProvider } from './components/Context/AuthProvider'
import{Route,Switch} from "react-router-dom"
import Login from "./components/Login/Login"
import Signup from "./components/Signup/Signup"
import HomePage from './Pages/HomePage'
import "./App.css"


export default function App() {
  const history=useHistory()
  const{userState,userDispatch}=useAuthProvider()
  useEffect(()=>{

const token=localStorage.getItem("jwt")
if(token){

 
const fetchMyData=async()=>{

  fetch("http://localhost:8080/myData",{
    headers:{
      "content-Type":"application/json",
       "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    method:"GET",
    
  }).then(res=>res.json())
  .then(async data=>{
   userDispatch({type:"USER",payload:data.mydata})
   
   
  })

}

   fetchMyData()
}
else{
  history.push('/login')
}

return ()=>{}

  },[])

  return (
    <div className="App">   
      
      <Switch>

      <Route exact path='/' component={HomePage}/>
      <Route exact path='/signup' component={Signup}/>
       <Route exact path='/login' component={Login}/>
      
      
      


      </Switch>
     
</div>
  );
}
