const express=require("express");
const router=express.Router();
const requireLogin = require("../middleware/requireLogin")
const Conversation = require("../models/conversation")

router.post("/addconversation",async (req,res)=>{
    let senderid=req.body.senderid;
    let recieverid=req.body.recieverid;

   try  {
  const exist=await Conversation.findOne({members:{$all:[senderid,recieverid]}})

  if(exist){
   return res.status(200).json({message:"Conversation allready exist"})

  }
    
   const newConversation= new Conversation({
        members:[ senderid, recieverid ]
    })

    await newConversation.save()
    return res.status(200).json({message:"New conversation added successfully"})
}

catch (err) {
  return  res.status(422).json({error:err})
}

})

router.post("/getconversation",(req,res)=>{

Conversation.findOne({members:{$all:[req.body.sender,req.body.reciever]}})
.then(conversation=>{
  return res.json({data:conversation})
})
.catch(err=>{
  return res.json({error:err})
})

})




module.exports=router