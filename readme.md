Chat Application README

Introduction:
This is a simple chat application built using Node.js and Socket.IO. It allows users to connect, send messages, and receive messages in real-time. The application supports basic chat functionality as well as private messages and group private messages.


Installation Instructions:

Prerequisites:
1. Node.js installed on your system. You can download it from https://nodejs.org/.
2. Basic knowledge of the command line interface (CLI) for running commands.

Installation Steps:
1. Install the required Node.js dependencies by running the following command:
    npm install

2. Start the server by running the following command:
    npm start

3. Once the server is running, open a web browser and navigate to the following URL:
    "http://localhost:3000/chatClient.html"

4. You should now be able to use the chat application. Follow the connection requirements mentioned in the BELOW to connect and start chatting.


Connection Requirements:
1. To connect to the chat server, open a web browser and navigate to the URL "http://localhost:3000/chatClient.html".
2. Enter your desired username in the dedicated text field.
3. Click on the "Connect As" button to register as a user and join the chat.
4. Once connected, you can start sending and receiving messages.

Chatting Requirements:
1. To send a message, type your message in the text field labeled "Type your message" and press the "Send" button or press the Enter key.
2. Your message will be displayed to all connected users.
3. You can clear the chat content by clicking the "Clear" button. Note that this action only clears the chat content on your client's window.

Private Message Requirements:
1. To send a private message to a specific user, type "username: Your message" in the message input field and press "Send" or press Enter.
2. Only the specified user will receive the message. The message will also be displayed on your client's window, indicating that it was sent privately.
3. Private messages are displayed in red text on both the sender's and recipient's client windows.

Group Private Message Requirements:
1. To send a group private message to multiple users, type "username1, username2, username3: Your message" in the message input field and press "Send" or press Enter.
2. Only the specified users will receive the message. The message will also be displayed on your client's window, indicating that it was sent privately to a group.
3. Group private messages are displayed in red text on both the sender's and recipients' client windows.

Disconnecting:
1. To disconnect from the chat server, click the "Disconnect As" button. This will unregister your username and close the connection to the server.

Security Note:
1. The application ensures message routing is done server-side to prevent unauthorized access to messages. Messages are only delivered to intended recipients.
