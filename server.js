// Importing necessary modules
const express = require('express'); // Express framework for building web applications
const http = require('http'); // HTTP module for creating HTTP server
const socketIo = require('socket.io'); // Socket.IO for real-time bidirectional event-based communication
const path = require("path"); // Path module for working with file paths

// Setting up constants
const PORT = 3000; // Port number for the server
const app = express(); // Creating an Express application instance
const server = http.createServer(app); // Creating an HTTP server instance using Express app
const io = socketIo(server); // Creating a Socket.IO instance

// Object to store connected users
let connectedUsers = {};

// Directory for serving static HTML files
const HTML_DIR = path.join(__dirname, '/html/');

// Serving static HTML files
app.use(express.static(HTML_DIR));

// Route to serve the chat client HTML file
app.get('/chatClient.html', (req, res) => {
    res.sendFile(HTML_DIR + '/index.html');
});

// Handling socket connections
io.on('connection', (socket) => {

    // Event handler for user registration
    socket.on('register', (username, callback) => {
        // Validation for username
        if (!username || !/^[a-zA-Z0-9]+$/.test(username)) {
            return callback('Invalid username. Please use alphanumeric characters only.');
        }

        // Check if username is already in use
        if (connectedUsers[username]) {
            return callback('Username is already in use. Please choose another one.');
        }
        connectedUsers[username] = socket.id;

        // Sending registration confirmation to the client
        io.to(socket.id).emit('register message', { message: `You are connected to CHAT SERVER`, socketId: socket.id });

        console.log(`New client connected: ${username}`);
        callback(null);
    });

    // Event handler for user disconnection
    socket.on('disconnectUser', () => {
        const username = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
        if (username) {
            delete connectedUsers[username];
            console.log(`${username} disconnected`);
        }
    });

    // Event handler for handling chat messages
    socket.on('chat message', (message) => {
        const sender = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
        if (!sender) return;

        // Parsing group receiver and message content
        const [groupReciever, displayMessage] = message?.includes(":") ? message?.split(':') : []

        // Handling group messages
        if (groupReciever?.split(',').length >= 2) {
            const recipients = groupReciever.split(',')
            recipients.forEach(recipient => {
                if (connectedUsers[recipient.trim()]) {
                    io.to(connectedUsers[recipient.trim()]).emit('group message', { message: `${sender}: ${displayMessage}`, socketId: socket.id });
                }
            });
            io.to(socket.id).emit('group message', { message: `You: ${displayMessage}`, socketId: socket.id });
        } 
        // Handling private messages
        else if (groupReciever?.split(',').length <= 1) {
            const recipient = groupReciever.split(',')
            if (connectedUsers[recipient[0].trim()]) {
                io.to(connectedUsers[recipient[0].trim()]).emit('private message', { message: `${sender}: ${displayMessage}`, socketId: socket.id });
                io.to(socket.id).emit('private message', { message: `You: ${displayMessage}`, socketId: socket.id });
            }
        } 
        // Handling broadcast messages
        else {
            Object.keys(connectedUsers)?.forEach(recipient => {
                io.to(connectedUsers[recipient.trim()]).emit('chat message', { message: `${connectedUsers[recipient.trim()] === socket.id ? "You" : sender}: ${message}`, socketId: socket.id });
            });
        }
    });
});

// Starting the server
server.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}. Press CNTL-C to quit.`);
    console.log("To Test:");
    console.log(`Open several browsers at http://localhost:${PORT}/chatClient.html`);
});
