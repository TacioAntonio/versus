const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:4200"],
        credentials: true,
    }
});

let connectedUsers = [];
let activeClients = {};

let waitingQueue = [];

app.use(cors());

const gameName = (socket) => {
    socket.on('optionChosen', (socketChoseGame, roomJoined, option) => {
        io.to(roomJoined).emit('onOptionChosen', socketChoseGame, option);
    });
};

io.on('connection', (socket) => {
    function createUser() {
        activeClients[socket.id] = socket;
        connectedUsers.push(socket.id);
        socket.emit('username', socket.id);
    }

    const emitConnectedUsers = _ => io.emit('connectedUsers', connectedUsers);

    function disconnectUser(socket) {
        if (activeClients[socket]) {
            activeClients[socket].disconnect();
            delete activeClients[socket];
        }

        connectedUsers = connectedUsers.filter((client) => client !== socket);
        waitingQueue = waitingQueue.filter((client) => client.id !== socket);
    }

    createUser();
    emitConnectedUsers();

    socket.on('joinRoom', () => {
        if (waitingQueue.length > 0) {
            const partnerSocket = waitingQueue.shift();
            const roomID = `${socket.id}/${partnerSocket.id}`;
            socket.join(roomID);
            partnerSocket.join(roomID);
            io.to(roomID).emit('roomJoined', {
                hostSocket: socket.id,
                partnerSocket: partnerSocket.id,
                roomID
            });
        } else {
            waitingQueue.push(socket);
        }
    });

    socket.on('joinGameRoom', (socketChoseGame, roomJoined, gameUrl) => {
        io.to(roomJoined).emit('gameRoomJoined', socketChoseGame, gameUrl);
    });

    socket.on('deleteRoom', (roomJoined) => {
        (roomJoined && 
            io.socketsLeave(roomJoined),
            delete io.of('/').adapter.rooms[roomJoined]
        );
    })

    socket.on('sendMessage', (socketSendMessage, roomJoined, partnerUsername, message) => {
        io.to(roomJoined).emit('messageReceived', socketSendMessage, partnerUsername, message);
    });

    socket.on('disconnectSocket', (socket) => {
        if (activeClients[socket]) {
            activeClients[socket].emit('redirectHome', socket);
        }
        disconnectUser(socket);
        emitConnectedUsers();
    });

    socket.on('disconnect', () => {
        disconnectUser(socket.id);
        emitConnectedUsers();
    });

    gameName(socket);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Online server in ${PORT}`));
