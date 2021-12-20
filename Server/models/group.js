const mongoose= require('mongoose');
const User=require("./user")
const {ObjectId}= mongoose.Schema.Types


const groupSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true
        
    },
    description:{
        type:String,
        required: true
        
    },
    profilephoto:{
        type:String,
        default:"https://img.icons8.com/dusk/50/000000/user-group-man-man.png"
     },
     createdBy:{
          type: ObjectId,
          ref: "User"       
            
     },
     createdAt : {
        type: Date,
        default:Date.now
    }
    
})

const Group= new mongoose.model("Whatsappagroup", groupSchema);
    
module.exports  =Group;
