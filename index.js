const express = require('express');
const cors = require('cors');
const http = require('http')
const SocketIO = require('socket.io')
const path = require('path')

const app = express();
const server = http.createServer(app)
const io = SocketIO(server, {
    cors: {
        origin: "*", // Replace with your frontend's origin
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

const dataController = require('./controller/dataController')

app.use(cors())
app.use(express.json());
app.use('/data', dataController)

app.get('/', (req, res) => {
    res.json('this is coming from backend');
})

io.on('connection', (socket) => {
    console.log('A user connected');
    // Handle disconnections if necessary
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(8081, () => {
    console.log('listening.....');
})