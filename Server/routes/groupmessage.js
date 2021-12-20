const express= require('express');
const router=express.Router();
const GroupMessage = require("../models/groupmessage");
const User= require('../models/user')
const requireLogin =require("../middleware/requireLogin")



router.post("/addgroupmessage",(req,res)=>{
    const newMessage= new GroupMessage(req.body)

    newMessage.save()
    .then(message=>{
        res.status(200).json({message:message})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

router.post("/getgroupmessage",(req,res)=>{
    GroupMessage.find({groupId:req.body.groupId})
    .populate("sender","name",User)
    .then(messages=>{
        res.json({messages:messages})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})


router.post("/deletegroupmsg",requireLogin,(req,res)=>{
    GroupMessage.findByIdAndDelete({_id:req.body.messageId})
    .then(msg=>{
        res.json({message:msg})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})


module.exports=router;