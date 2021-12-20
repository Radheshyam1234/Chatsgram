const express= require('express');
const router=express.Router();
const Message = require("../models/message");
const requireLogin =require("../middleware/requireLogin")

router.post("/addmessage",(req,res)=>{
    const newMessage= new Message(req.body)

    newMessage.save()
    .then(message=>{
        res.status(200).json({message:message})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})


router.post("/getChats",(req,res)=>{
    Message.find({conversationId:`${req.body.conversationId}`})
    .then(messages=>{
        res.json({messages:messages})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})


router.post("/deletemsg",requireLogin,(req,res)=>{
    Message.findByIdAndDelete({_id:req.body.messageId})
    .then(msg=>{
        res.json({message:msg})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})



module.exports=router;