const mongoose= require('mongoose');
const User=require("./user")
const Group=require("./group")
const {ObjectId}= mongoose.Schema.Types

const groupMessageSchema= new mongoose.Schema({  
    groupId :{
        type: ObjectId,
        ref: "Group"   
    },
    sender:{
          type: ObjectId,
          ref: "User"       
            
     },
     message:{
        type:String,
        required:true
    },   
    type:{
        type:String,
        required:true
    }
},
    
    {
        timestamps:true
    }
    
)

const GroupMessage= new mongoose.model("WhatsappagroupMessages", groupMessageSchema);
    
module.exports  =GroupMessage;
