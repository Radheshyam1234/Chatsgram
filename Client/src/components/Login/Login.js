import React,{useState} from 'react'
import {useHistory} from "react-router"
import { Link } from "react-router-dom"
import { useAuthProvider } from '../Context/AuthProvider'
import { toast } from 'react-toastify';
import "./Login.css"

toast.configure()

const Login=()=>{
  const history=useHistory()
  const{userDispatch}=useAuthProvider();
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

  const getSignin=(e)=>{
    e.preventDefault();
    fetch("http://localhost:8080/signin",{
      headers:{
        "content-Type":"application/json",
      },
      method:"POST",
      body:JSON.stringify({
        email,
        password
      })
    }).then(res=>res.json())
    .then(result=>{
       if(result.error){
        toast.error(result.error,{position:toast.POSITION.TOP_CENTER});
        history.push('/login')
       }
       else{
        userDispatch({type:"USER",  payload:result.user})
        localStorage.setItem("jwt",result.token)
              
           history.push('/')
  
       }
      
    })
    .catch(err=>{
      console.log(err)
    })

  }
    return(
      <div className="login-form">
       <div className="form-input">
      <div className="form-group ">
         <input type="text" className="form-control" placeholder="Email " id="Email"   value={email}
           onChange={(e)=>{setEmail(e.target.value)}}
         
         /> 
        
         </div>
      <div className="form-group ">
         <input type="password" className="form-control" placeholder="Password" id="Passwod" value={password}
           onChange={(e)=>{setPassword(e.target.value)}}
         /> 
      
       </div> 
        <div className="login-btn">
       <button type="submit" className="log-btn" onClick={(e)=>{getSignin(e)}}> Log in</button><br/>
       <button type="submit" className="log-btn" onClick={(e)=>{setEmail("guest123@gmail.com");setPassword("12345")}}> Guest User</button><br/>
       </div>
      <p style={{color:"white"}}>Don't have an account ? <Link to ="/signup" >Sign Up</Link></p>
  </div>
  </div>
    )
}

export default Login;