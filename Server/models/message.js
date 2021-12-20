const mongoose= require('mongoose');

const messageSchema= new mongoose.Schema({
    conversationId:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
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



const Message= new mongoose.model("Whatsappmessages",messageSchema);
    
module.exports  = Message;
