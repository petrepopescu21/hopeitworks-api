require('dotenv').config()
var cors = require('cors')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {transports: ['websocket', 'xhr-polling']});
var multer = require('multer')
var MulterAzureStorage = require('multer-azure-storage')
var upload = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: process.env.IMAGE_STORAGE,
        containerName: 'photos',
        containerSecurity: 'blob'
    })
})

app.use(cors())

app.get('/', function(req, res){
    res.send("Hello World!")
});

app.post('/describeImage', upload.any(), (req,res)=>{
    console.log('Hello')
    console.log(req.body)
    io.emit('imageMessage',req.body)
})

app.post('/upload', upload.single('photos'), (req,res)=>{
    console.log(req.body)
    io.emit('imageMessage',{
        message: req.file.url,
        user_name: req.body.user_name,
        user_id: req.body.user_id,
        id: req.body.id,
        type: "image",
        timestamp: new Date()
    })
    res.send('OK')
})

io.on('connection', function(socket){
    let name = socket.handshake.query.name
    io.emit('conn', {name:name, timestamp:new Date()})

    socket.on('message',(data)=>{data.timestamp=new Date()
        socket.broadcast.emit('message',data)
    })

    socket.on('disconnect',(reason)=>{
        io.emit('disconn', {name:name, time:new Date()})
    })
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:'+(process.env.PORT || 3000));
});
   