var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    let name = socket.handshake.query.name
    console.log('a user connected ' + name);
    io.emit('conn', {name:name, time:new Date()})

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('message',data)
    })

    socket.on('disconnect',(reason)=>{
        console.log('a user disconnected ' + name)
        io.emit('disconn', {name:name, time:new Date()})
    })
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:'+(process.env.PORT || 3000));
});
   