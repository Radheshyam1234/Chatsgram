const express= require('express');
const mongoose= require('mongoose');
const Message =require('./message');
const {ObjectId}= mongoose.Schema.Types

const userSchema= new mongoose.Schema({

    name:{
        type:String,
        required: true
        
    },
    email:{
        type:String,
        required: true
        
    },
    profilephoto:{type:String,
       default:""
    },
    
    about:{
     type:String,
     default:"Hey there! I am using WhatsApp"
    },
    
    password:{
        type:String,
        required: true
        
    },
    
    starredmessage:[{type:ObjectId,ref:"Message"}]
    ,

    joinedOn : {
        type: Date,
        default:Date.now
    }
    
    
    })
    
    
    const User= new mongoose.model("Whatsappauser",userSchema);
    
    module.exports  = User;



    // http://res.cloudinary.com/radheshyam11/image/upload/v1628524847/ggfox5fjnoqc5ldummob.png