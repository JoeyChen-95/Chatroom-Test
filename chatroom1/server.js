const app = require('express')(); //用express库生成实例app
const server = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
let login_username = ''

app.get('/',(req,res)=>{ //收到请求时候把html作为响应的文件发送出去
    res.sendFile(__dirname+'/index.html');
});


io.on('connection',socket => {
    console.log('有人进入聊天室');

    socket.on('login',username=>{
        io.emit('login',username)

        login_username = username
        console.log(username)
    })

    socket.on('chat message',msg=>{
        io.emit('chat message',msg)
        console.log(msg)
    });

    socket.on('disconnect',()=>{
        console.log('有人离开聊天室');
    });
});

server.listen('3000',()=>'服务器开启');