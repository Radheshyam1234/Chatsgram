const express=require("express");
const router=express.Router();
const requireLogin = require("../middleware/requireLogin")
const User= require('../models/user')
const Group= require("../models/group")

router.post("/creategroup",(req,res)=>{
    const {name,description,createdBy}=req.body;
    const NewGroup= new Group({name,description,createdBy})

NewGroup.save()
.then(Group=>{
    res.json({message:Group});
})
.catch(err=>{
   console.log(`error while creating`)
})
})

router.get('/groups',(req,res)=>{
    Group.find()
    .populate("createdBy","name", User)
    .sort('-createdAt')
    .then(groups=>{
        return res.json({groupss:groups})
    })
    .catch(err=>{
       return res.status(422).json({err:err})
    })
})

router.post("/editgroupinfo",(req,res)=>{
 
    Group.findByIdAndUpdate(req.body.groupId,{
        $set:{name:req.body.groupname,description:req.body.description}
     },{
        new:true
     } )
     .populate("createdBy","name",User)
     .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
})

router.post("/groupprofilepic",(req,res)=>{
 
    Group.findByIdAndUpdate(req.body.groupId,{
        $set:{profilephoto:req.body. url}
     },{
        new:true
     } )
     .populate("createdBy","name",User)
     .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
})




module.exports=router