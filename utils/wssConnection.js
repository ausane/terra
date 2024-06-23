const WebSocket = require('ws');
const { saveMessage, saveSeenMessage } = require('./messageFunctions.js');

function incomingMessage(ws, wss, message, userMap) {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.messageId) {
        saveSeenMessage(parsedMessage)
            .then(async (savedMessage) => {
                wss.clients.forEach(function each(client) {
                    const recipientWs = userMap.get(savedMessage.recipient);
                    if (recipientWs === client && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(savedMessage));
                    }
                });
            })
            .catch(error => {
                console.error('Error saving message to database:', error);
            });
    } else if (parsedMessage.message) {
        saveMessage(parsedMessage)
            .then((savedMessage) => {
                wss.clients.forEach(function each(client) {
                    const recipientWs = userMap.get(savedMessage.recipient);
                    if (recipientWs === client && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(savedMessage));
                    }
                });
            })
            .catch(error => {
                console.error('Error saving message to database:', error);
            });
    } else if (parsedMessage.id) {
        // Associate user ID with WebSocket connection
        userMap.set(parsedMessage.id, ws);
    }
}

function onClose(ws, userMap) {
    // Remove WebSocket connection from the map when closed
    userMap.forEach((value, key) => {
        if (value === ws) {
            userMap.delete(key);
        }
    });
}

module.exports = { incomingMessage, onClose };