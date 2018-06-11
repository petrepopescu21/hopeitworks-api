require('dotenv').config()
var cors = require('cors')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
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

app.post('/upload', upload.single('photos'), function(req,res){
    console.log(req.body)
    io.emit('imageMessage',{
        message: req.file.url,
        user_name: req.body.user_name,
        id: req.body.user_id,
        type: "image",
        timestamp: new Date()
    })
    res.send('OK')
})

io.on('connection', function(socket){
    let name = socket.handshake.query.name
    io.emit('conn', {name:name, time:new Date()})

    socket.on('message',(data)=>{
        socket.broadcast.emit('message',data)
    })

    socket.on('image',(data)=>{
        console.log(data)
        io.emit('image',data)
    })

    socket.on('disconnect',(reason)=>{
        io.emit('disconn', {name:name, time:new Date()})
    })
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:'+(process.env.PORT || 3000));
});
   