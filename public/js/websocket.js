// Establish WebSocket connection
const socket = new WebSocket('wss://terra-uyvg.onrender.com');

// Event listener for WebSocket connection opened
socket.addEventListener('open', function (event) {
    const user = {
        id: currentUserId,
    }

    socket.send(JSON.stringify(user));
});


// Event listener for WebSocket messages received
socket.addEventListener('message', function (event) {
    const message = JSON.parse(event.data);

    if (message.newMessage) unseenMessageChatFunc(message.newMessage.author);

    function isConnected(message, currentUserId, participantId) {

        if (message.recipient !== currentUserId) {
            return false; // Early exit if recipient doesn't match
        } else if (message.newMessage) {
            return message.newMessage.author === participantId;
        } else if (message.seenMessage) {
            return message.seenMessage.author === participantId;
        }

        // If neither newMessage nor seenMessage exists, handle edge case
        return false;
    }

    // Usage:
    const condition = isConnected(message, currentUserId, participantElementId);


    if (condition) {
        if (message.seenMessage) {
            const seenMessage = document.getElementById(message.seenMessage.id);
            seenMessage.textContent = ' · Seen';
        } else if (message.newMessage) {
            addMessagesToConversation(message.newMessage);
            conversationMessages.style.scrollBehavior = 'smooth';
            bottomOfConversation();
        }
    }
});


// Function to send a message
sendMessageBtn.addEventListener('click', () => {
    const messageText = messageTextarea.value.trim();

    if (messageText && messageText.length <= 450) {
        const time = Date.now();

        const message = {
            _id_user1: currentUserId,
            _id_user2: participantElementId,
            message: messageText,
            timestamp: time,
        }

        // Convert the message to JSON
        const jsonMessage = JSON.stringify(message);
        socket.send(jsonMessage);

        messageTextarea.value = '';

        const newMessage = {
            author: currentUserId,
            message: messageText,
            timestamp: time,
            seen: false
        }

        addMessagesToConversation(newMessage);
        messageTextarea.style.height = '40px';
        conversationMessages.style.bottom = '4rem';
        sendMessageBtn.disabled = true;
        sendMessageBtn.style.opacity = '.5';
        sendMessageBtn.style.cursor = 'auto';
        messageTextarea.focus();
        conversationMessages.style.scrollBehavior = 'smooth';
        bottomOfConversation();
    } else {
        throw new Error("Message cannot be empty and too long!");
    }
});


const seenMessages = (message) => {
    const seenMessage = {
        author: currentUserId,
        recipient: participantElementId,
        messageId: message.id,
        seen: true,
    }

    socket.send(JSON.stringify(seenMessage));
}

const targetElements = document.querySelectorAll('.newMessage');
targetElements.forEach(element => newObserver.observe(element));