import React,{useState} from 'react'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'


const Signup=()=>{
   
   const[name,setName]=useState("");
   const[email,setEmail]=useState("");
   const[password,setPassword]=useState("");


    const signup=(e)=>{
        e.preventDefault();
        fetch("http://localhost:8080/signup",{
        method:"POST",
        headers:{
            "content-Type":"application/json",
            
        },
        body:JSON.stringify({
            name,
            email,
            password
        })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
             if(result.error)
             toast.error(result.error,{position:toast.POSITION.TOP_CENTER}); 
            
            else
            toast.success(result.message,{position:toast.POSITION.TOP_CENTER});
           
        })
    }
    return(
      <div className="login-form">
           <div className="form-input">
      
      <div className="form-group ">
         <input type="text" placeholder="Username " id="UserName"
             onChange={(e)=>{setName(e.target.value)}}
         />  </div>
      <div className="form-group ">
         <input type="email"  placeholder="Email" id="Email"
             onChange={(e)=>{setEmail(e.target.value)}}
         /> 
       </div> 
       <div className="form-group log-status">
         <input type="password" placeholder="Password" id="Passwod"
             onChange={(e)=>{setPassword(e.target.value)}}
         /> 
       </div>
       
       <div className="login-btn">
        <button type="submit" className="log-btn" onClick={(e)=>{signup(e)}}>Sign Up</button>
        <p style={{color:"white"}}>Have an account <Link to ="/login">Sign In</Link></p>
        </div>
  </div>
  </div>
    )
}

export default Signup;