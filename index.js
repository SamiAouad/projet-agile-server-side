const express = require("express")
const cors = require('cors');
const app = express()
const bodyParser = require('body-parser')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const user = require('./user/user.js')
const voyage = require('./voyage/voyage.js')
const groupe = require('./groupe/groupe.js')
const post = require('./post/post.js')

app.use(express.static("./public"))

app.use('/user', user, cors(corsOptions))
app.use('/groupe', groupe, cors(corsOptions))
app.use('/voyage', voyage, cors(corsOptions))
app.use('/post', post, cors(corsOptions))

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat', payload => {
        console.log('new message')
        io.emit('chat', payload)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.listen(5000, () => {
    console.log('starting server on port 5000')
})

/*io.listen(8000, () => {
    console.log('starting socket server on port 8000')
})*/


