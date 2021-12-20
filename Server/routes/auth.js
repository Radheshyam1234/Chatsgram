const express= require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User= require('../models/user')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys');



router.post('/signup',(req,res)=>{
   
    const {name,email,password}=req.body;
    console.log(name)
    
    if(!name||!email||!password){
        return res.status(422).json({error:"Please fill all the required details"})
    }
    
    User.findOne({email:email})
    .then((userExist) =>{
        if(userExist)
        {return res.status(422).json({error:"User already exist with this email "})
      
        }
        bcrypt.hash(password,12).then((hashedpassword)=>{
    const Newuser= new User({name,email,
        password:hashedpassword})
    Newuser.save()
    .then(User=>{
        res.json({message:"Signed up successfully. Proceed to login"});
    })
    .catch(err=>{
       console.log(`error while saving`)
    })
    
    })
    .catch(err=>{
        console.log(error);
    })
    })
       .catch(err=>{
           
       })
    
    })
    router.post('/signin',(req,res)=>{
        const {email,password}=req.body;
        
        if(!email||!password)
        {
           return res.status(422).json({error:"Please enter email or password"});
        }
    
    User.findOne({email:email})
    .then(savedUser=>{
    if(!savedUser){
       return res.status(422).json({error:"Invalid email or password"});
    }
    
    bcrypt.compare(password,savedUser.password)
    
    .then(matched=>{
        if(matched){
        
       const token= jwt.sign({_id:savedUser._id},JWT_SECRET)
       const {_id,name,email,profilephoto,about,joinedOn,starrredmessage}=savedUser
         res.json({token:token,user:{_id,name,email,profilephoto,about,joinedOn,starrredmessage}})
    
    
        }
        else{
            return res.status(422).json({error:"invalid email or password"})
        }
    })
    .catch(err=>{
        console.log("Eeerror")
    })
    
    })
    
    })

module.exports=router;