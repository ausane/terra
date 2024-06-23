const User = require('../models/user.js');
const Chat = require('../models/chat.js');
const { validateMongoId } = require('../utils/PostExist.js');


const findMessages = async (req, res, next) => {
    try {
        const _id_user = req.user._id;

        const userChatsData = await User.findById(_id_user).populate('chatIds');
        const chatIds = userChatsData.chatIds;

        const chats = [];

        // Check each chat for unseen messages
        for (const chatId of chatIds) {
            const chat = await Chat.findOne({
                $or: [
                    { $and: [{ "user1": _id_user }, { "user2": chatId._id }] },
                    { $and: [{ "user1": chatId._id }, { "user2": _id_user }] }
                ]
            }).populate('messages');

            const unseenMessages = chat.messages.filter(message => !message.seen);
            const hasUnseenMessagesFromOthers = unseenMessages.some(message => !message.author.equals(_id_user));

            chats.push({
                chatId: chatId,
                hasUnseenMessages: hasUnseenMessagesFromOthers
            });
        }

        res.render('messages.ejs', { chats });
    } catch (error) {
        next(error);
    }
}

const searchToMessage = async (req, res, next) => {
    try {
        const user = req.user.username;
        const searchTerm = req.body.username;

        const regex = new RegExp(searchTerm, 'i');

        const allUsers = await User.find({ username: regex });
        const data = allUsers.filter(item => item.username !== user);

        res.json(data);
    } catch (error) {
        next(error);
    }
}


const sendConversation = async (req, res, next) => {
    try {
        const id_user1 = req.user._id;
        const id_user2 = req.params.id;

        validateMongoId(id_user2);

        const conversation = await Chat.findOne({
            $or: [
                { $and: [{ "user1": id_user1 }, { "user2": id_user2 }] },
                { $and: [{ "user1": id_user2 }, { "user2": id_user1 }] }
            ]
        });

        if (conversation) {
            return res.json(conversation);
        } else {
            return res.json({ new: true });
        }
    } catch (error) {
        next(error);
    }
}


module.exports = { findMessages, searchToMessage, sendConversation };