require('dotenv').config()
var cors = require('cors')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { transports: ['websocket', 'xhr-polling'] });
var multer = require('multer')
var MulterAzureStorage = require('multer-azure-storage')
var upload = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: process.env.IMAGE_STORAGE,
        containerName: 'photos',
        containerSecurity: 'blob'
    })
})
var axios = require('axios')
var uuidv1 = require('uuid/v1')

app.use(cors())

app.get('/', function (req, res) {
    res.send("Hello World!")
});


app.post('/upload', upload.single('photos'), (req, res) => {
    console.log('Printing out URL')
    console.log(req.file.url)
    axios.post(process.env.LOGIC_APP_TRIGGER,
        { url: req.file.url }).then(res => {
            console.log(res.data.description)
            io.emit('describeImage', {
                message: "@" + req.body.user_name + " - Your image contains " + res.data.description.captions[0].text,
                user_name: "Vision Bot",
                user_id: "v1s10nb00t",
                id: "1",
                type: "message",
                timestamp: new Date()
            })
        })
    io.emit('imageMessage', {
        message: req.file.url,
        user_name: req.body.user_name,
        user_id: req.body.user_id,
        id: req.body.id,
        type: "image",
        timestamp: new Date()
    })
    res.send('OK')
})

io.on('connection', function (socket) {
    let name = socket.handshake.query.name
    //io.emit('conn', { name: name, timestamp: new Date(), id:uuidv1() })

    socket.on('message', (data) => {
        data.timestamp = new Date()
        socket.broadcast.emit('message', data)
    })

    socket.on('disconnect', (reason) => {
    //io.emit('disconn', { name: name, timestamp: new Date(), id:uuidv1() })
    })
});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening on *:' + (process.env.PORT || 3000));
});
