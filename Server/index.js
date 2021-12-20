const express= require('express');
const app = express();
const { MONGOURI}= require('./config/keys')
const PORT = process.env.PORT||8080
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())

const cors=require('cors')

mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
console.log(`connected to database`)
}).catch((err)=>{
    console.log(err);
})
app.get("/welcome",(req,res)=>{
    res.send("Welcome to Backend")
})
 app.use(cors())
const routes=require('./routes/auth')
app.use('/',routes)
app.use('/',require("./routes/users"))
app.use('/',require("./routes/conversation"))
app.use('/',require("./routes/message"))
app.use('/',require("./routes/group"))
app.use('/',require("./routes/groupmessage"))

const server = app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`)
})

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    }
})


let users=[];

const addUser=(userId,socketId)=>{
    !users.some(user=>user.userId===userId) && users.push({userId,socketId})
}

const getUser=(userId)=>{
  return users.find(user=>user.userId===userId)
}

io.on("connection",(socket)=>{
    console.log("user connected");

    socket.on('addUser',userId=>{
        addUser(userId,socket.id);
        io.emit("getUsers", users);

    })


    
    socket.on('sendmessage',({senderId,recieverId,text,type})=>{
        const user=getUser(recieverId);
      
        if(user){
           io.to(user.socketId).emit('getMessage',{
               senderId,text,type
           })
        }
        
     })
   
     
     socket.on('deletemessage',({senderId,recieverId,message})=>{
       const user=getUser(recieverId);
        
       if(user){
           io.to(user.socketId).emit('removemessage',{
               senderId,recieverId,message
           })
       }
   })


     socket.on('groupmessage',({senderId,groupId,text,type})=>{
          io.emit('getGroupMessage',{
              senderId,groupId,text,type
          })
       
       
    })

    socket.on('deletegroupmessage',({senderId,groupId,message})=>{
        console.log(message)
            io.emit('removegroupmessage',{
                senderId,groupId,message
            })
        
    })


    socket.on("disconnect", () => {
        console.log("a user disconnected")
        users=users.filter(user=>user.socketId!==socket.id);
        io.emit("getUsers", users);



      });



})

