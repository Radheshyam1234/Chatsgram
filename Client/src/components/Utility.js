export const postImage= async (image)=>{

 
    const data= new FormData()
   
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","radheshyam11")

    var res=await fetch("https://api.cloudinary.com/v1_1/radheshyam11/image/upload",{
        method:"post",
        body:data
    })
  var result=res.json()
  return result;


}

export const editBio=async(bio)=>{
try
{
 var res= await fetch("http://localhost:8080/editbio",{
    method:"POST",
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
        
    },
    body:JSON.stringify({
      description:bio
    })
    })
    return res.json()
  }
  catch(err){
    return
  }

}

export const editProfileName=async(name)=>{

  try{
    var res= await fetch("http://localhost:8080/profilename",{
    method:"POST",
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
        
    },
    body:JSON.stringify({
       profilename:name
    })
    })
    return res.json()
  }
  catch(err){
    return;
  }

 
 
 }

export const getConversationId=async (senderId,recieverId)=>{
 const res= await fetch("http://localhost:8080/getconversation",{
        headers:{
          "content-Type":"application/json",
        },
        method:"POST",
        body: JSON.stringify({
              sender:senderId,
              reciever:recieverId
        })  
      })
      return res.json()
}

export const GetChats=async(conversation_id)=>{

try{
  var res= await fetch("http://localhost:8080/getChats",{
    headers:{
        "content-Type":"application/json",
    },
    method:"POST",
    body: JSON.stringify({
    conversationId:conversation_id
    })  
})
return res.json()

}
 
catch(err){
  return;
}

 }

 export const AddStarredMessage=async(message)=>{
  var res= await fetch("http://localhost:8080/addstarmessage",{
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    method:"POST",
    body: JSON.stringify({
    messageId:message._id
    })  
})

return res.json()
 }

 export const RemoveStarredMessage=async(message)=>{
  var res= await fetch("http://localhost:8080/removestarmessage",{
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    method:"POST",
    body: JSON.stringify({
    messageId:message._id
    })  
})

return res.json()
 }

 export const GetGroupMessages=async(groupId)=>{
try{

  var res= await  fetch("http://localhost:8080/getgroupmessage",{
    headers:{
      "content-Type":"application/json",
    },
 method:"post",
    body: JSON.stringify({
           groupId:groupId,
 }) 

   })
   return res.json()
  }
  catch(err){return;}
 }

 export const SaveGroupInfo=async(groupId,groupname,description)=>{
  try{
  
    var res= await  fetch("http://localhost:8080/editgroupinfo",{
      headers:{
        "content-Type":"application/json",
      },
   method:"post",
      body: JSON.stringify({
             groupId:groupId,
             groupname,
             description
   }) 
  
     })
     return res.json()
    }
    catch(err){return;}
   }
  