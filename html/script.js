// script.js

document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000');
    const connectButton = document.getElementById('connect_as');
    const disconnectButton = document.getElementById('disconnect_as');
    disconnectButton.style.display = "none"

    const usernameInput = document.getElementById('usernameInput');

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const messagesDiv = document.getElementById('messages');

    socket.on('register message', (msg) => {
        registerAs(msg.message, msg.socketId);
    });
    socket.on('chat message', (msg) => {
        addMessage(msg.message, false, msg.socketId);
    });

    socket.on('private message', (msg) => {
        addMessage(msg.message, true, msg.socketId);
    });

    socket.on('group message', (msg) => {
        addMessage(msg.message, true, msg.socketId);
    });

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
    usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            connect();
        }
    });

    clearButton.addEventListener('click', () => {
        clearMessages();
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message !== '') {
            socket.emit('chat message', message);
            messageInput.value = '';
        }
    }

    function clearMessages() {
        messagesDiv.innerHTML = '';
    }

    function addMessage(msg, isPrivate = false, socketId) {
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = msg;
        if (isPrivate) {
            messageParagraph.classList.add('private-message');
        }
        if (socket.id === socketId) {
            messageParagraph.classList.add('sender');
        } else {
            messageParagraph.classList.add('receiver');
        }
        messagesDiv.appendChild(messageParagraph);

        messagesDiv.addEventListener('scroll', () => {
            let scrollTop = messagesDiv.scrollTop;
            let scrollHeight = messagesDiv.scrollHeight;
            let clientHeight = messagesDiv.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight) {
                console.log('Reached the bottom of the div');
            }
        });
        scrollToDivBottom()
    }

    function registerAs(msg) {
        document.getElementById('mainPara').style.display = 'block'
        document.getElementById('mainPara').innerText = msg
    }

    function connect() {
        const usernameValue = usernameInput.value.trim();
        if (usernameValue !== '') {
            socket.emit('register', usernameValue, (error) => {
                if (error) {
                    alert(error);
                } else {
                    document.getElementById('chatSection').style.display = 'block';
                    document.getElementById('mainTitle').style.display = 'block'
                    username = usernameValue;
                    connectButton.style.display = "none"
                    disconnectButton.style.display = "block"
                    usernameInput.disabled = true
                    connectButton.disabled = true
                }
            });
        }
    }

    function disconnectUser() {
        socket.emit('disconnectUser');
        document.getElementById('chatSection').style.display = 'none';
        document.getElementById('mainTitle').style.display = 'none'
        document.getElementById('chatSection').style.display = 'none';
        document.getElementById('mainPara').style.display = 'block'
        document.getElementById('mainPara').innerText = ''
        clearMessages()
        connectButton.style.display = "block"
        disconnectButton.style.display = "none"
        usernameInput.disabled = false
        connectButton.disabled = false
        username = undefined;
    }

    connectButton.addEventListener('click', () => {
        connect();
    });

    disconnectButton.addEventListener('click', () => {
        disconnectUser();
    });

    // Function to scroll to the bottom of the message box
    function scrollToDivBottom() {
        setTimeout(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 0);
    }
});
