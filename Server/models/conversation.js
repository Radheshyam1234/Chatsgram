
const mongoose= require('mongoose');

const conversationSchema= new mongoose.Schema({
  
    members:{
        type:Array
    },

    
    })
    
    
    const Conversation= new mongoose.model("Conversation",conversationSchema);
    
    module.exports  = Conversation;
