const Chat = require('../models/chat.js');
const User = require('../models/User.js');

const saveMessage = async (parsedMessage) => {
    const { _id_user1, _id_user2, message, timestamp } = parsedMessage;

    if (message && message.length > 450) {
        throw new CustomError(400, "Message cannot be empty and too long!");
    }

    const conversation = await Chat.findOne({
        $or: [
            { $and: [{ "user1": _id_user1 }, { "user2": _id_user2 }] },
            { $and: [{ "user1": _id_user2 }, { "user2": _id_user1 }] }
        ]
    });

    // New Message  
    const newMessage = {
        author: _id_user1,
        message: message,
        timestamp: timestamp,
        seen: false
    }

    if (conversation && message) {
        conversation.messages.push(newMessage);
        await conversation.save();
    } else {
        // Establish New Conversation For Messages
        const user1 = await User.findById(_id_user1);
        const user2 = await User.findById(_id_user2);

        const newConversation = new Chat({
            user1: user1,
            user2: user2,
        });

        // newConversation.save();
        user1.chatIds.push(user2);
        user2.chatIds.push(user1);

        await user1.save();
        await user2.save();

        newConversation.messages.push(newMessage);
        await newConversation.save();
    }

    return { newMessage: newMessage, recipient: _id_user2 };
}


const saveSeenMessage = async (seenMessage) => {
    const _id_user1 = seenMessage.author;
    const _id_user2 = seenMessage.recipient;
    const _id_message = parseInt(seenMessage.messageId);

    const conversation = await Chat.findOne({
        $or: [
            { $and: [{ "user1": _id_user1 }, { "user2": _id_user2 }] },
            { $and: [{ "user1": _id_user2 }, { "user2": _id_user1 }] }
        ]
    });

    if (conversation) {
        const message = conversation.messages.find(message => message.timestamp === _id_message);
        message.seen = true;
        await conversation.save();
    }

    return { seenMessage: { author: _id_user1, id: seenMessage.messageId, seen: true }, recipient: _id_user2 };
}


module.exports = { saveMessage, saveSeenMessage };