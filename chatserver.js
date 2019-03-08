var express = require('express');
var router = express.Router();
var app = express()


//routes
router.get('/', function(req, res){
    res.render('index')
})

server = app.listen(4000)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', function(socket) {
    console.log('New user connected')

    //default username
    socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username',function (data) {
        socket.username = data.username

    })

    //listen on new_message
    socket.on('new_message', function(data){
        //broadcast the new message
        console.log('message',data)
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', {username : socket.username})
    })
})

module.exports = router;


