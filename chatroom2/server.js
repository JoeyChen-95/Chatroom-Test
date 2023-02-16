const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server).sockets;

app.get('/', (req, res) => { //收到请求时候把html作为响应的文件发送出去
    res.sendFile(__dirname + '/index.html');
});

let connectedUser = [];


//Socket.io connect
io.on("connection", socket => {
    console.log('a user connected');
    updateUserName();
    let userName = '';

    //Login
    socket.on('login', (name, callback) => {
        if (name.trim().length === 0) { //prevent empty name

            //todo: can add some error message notification
            return;
        }
        callback(true); //make callback true
        userName = name; //get username
        connectedUser.push(userName); //add username into current connectedUser list
        // console.log(connectedUser);
        updateUserName();
    })
    //Receive chat message
    socket.on('chat message', msg => {

        //Emit message data to client
        io.emit('output', {
            name: userName,
            msg: msg
        })
    })
    //Disconnect
    socket.on('disconnect', () => {
        console.log("user disconnected");
        let index = connectedUser.indexOf(userName);
        if (index !== -1) {//If I have logged in
            connectedUser.splice(index, 1);//remove username from current connectedUser list
        }
        // console.log(connectedUser);
        updateUserName();
    })

    //Update username
    function updateUserName() {
        io.emit('loadUser', connectedUser);
    }


})

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});