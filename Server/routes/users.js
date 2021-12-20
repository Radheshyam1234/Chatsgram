const express=require("express");
const router=express.Router();
const requireLogin = require("../middleware/requireLogin")
const User= require('../models/user')
const Message=require('../models/message')
const GroupMessage = require("../models/groupmessage");


router.get('/users',(req,res)=>{
    User.find()
    .then(users=>{
        return res.json({users:users})
    })
    .catch(err=>{
       return res.status(422).json({err:err})
    })
})

router.get('/myData',requireLogin,(req,res)=>{
    if(req.user){
        return res.json({mydata:req.user})
    }
    else
    return res.status(422).json({error:"Couldn't fetch your data"})
})

router.post("/profilepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{profilephoto:req.body.url}
     },{
        new:true
     } )
     .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
})

router.post("/removepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{profilephoto:""}
     },{
        new:true
     } )
     .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
})


router.post("/profilename",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{name:req.body.profilename}
     },{
        new:true
     } )
     .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
})


router.post("/editbio",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{about:req.body.description}
     },{
        new:true
     } )
     .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
})


router.post("/addstarmessage",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $push:{ starredmessage:req.body.messageId}
    },{
        new :true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})


router.post("/removestarmessage",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $pull:{ starredmessage:req.body.messageId}
    },{
        new :true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})



router.post("/getstarmessage",requireLogin,(req,res)=>{
   User.findOne({_id:req.user._id})
   .populate("starredmessage","sender message type createdAt",Message)
   
   .then(result=>{
       return res.json(result)
   })
   .catch(err=>{
    return res.status(422).json({error:err})
   })
})



module.exports=router