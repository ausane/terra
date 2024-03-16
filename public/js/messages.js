const searchInputBox = document.getElementById('user-search-input-box');
const foundedUsers = document.getElementById('matched-usernames');
const usersElements = document.querySelectorAll('.users-elements');
const startedConversations = document.getElementById('started-conversations');
const searchMessagesBackground = document.getElementById('search-messages-background');
const conversationParticipant = document.getElementById('conversation-participant');
const sendMessageForm = document.getElementById('send-message-form');
const lastOfConversation = document.getElementById('last-of-conversation');
const sendMessageBtn = document.getElementById('send-message-btn');
const messageTextarea = document.getElementById('message-textarea');
const conversationMessages = document.getElementById('conversation-messages');
const sendMessageInputBox = document.getElementById('send-message-input-box');
const unseenChatMessages = document.querySelectorAll('.unseen-chat-messages');


searchInputBox.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();

    if (searchTerm !== '') {
        fetch('/messages/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: searchTerm })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not okay.');
                }
            })
            .then(data => {
                searchedOutput(data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        foundedUsers.innerHTML = '';
    }
});

const searchedOutput = (data) => {
    foundedUsers.innerHTML = '';

    data.forEach(el => {
        const userElement = document.createElement('div');
        const userDpElement = document.createElement('img');
        const usernameElement = document.createElement('p');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');

        userElement.setAttribute('id', el._id);
        userDpElement.src = `/images/${el.picture}`;
        userDpElement.classList.add('picture');
        userElement.classList.add('users-elements');
        usernameElement.classList.add('searched-users', 'flex');
        userElement.addEventListener('click', () => startConversation(userElement));

        span1.textContent = el.name ? el.name : el.username;
        span2.textContent = '@' + el.username;
        span2.classList.add('span2-username');
        usernameElement.append(span1, span2);

        userElement.append(userDpElement, usernameElement);

        foundedUsers.append(userElement);
    });
}


const displaySMG = () => {
    searchMessagesBackground.displayFlex();
    searchInputBox.focus();
}

const removeSMG = () => {
    searchMessagesBackground.displayNone();
    searchInputBox.value = null;
    foundedUsers.innerHTML = '';
}


function startConversation(userElement) {
    removeSMG();

    let shouldReturn = false;

    document.querySelectorAll('.users-elements').forEach(el => {
        if (el.id === userElement.id) {
            clickedConversation(el);
            fetchConversationsData(el);
            shouldReturn = true;
        }
    });

    if (!shouldReturn) {
        const copiedElement = userElement.cloneNode(true);
        copiedElement.classList.add('users-elements');

        copiedElement.addEventListener('click', function () {
            clickedConversation(this);
            fetchConversationsData(this);
        });

        startedConversations.prepend(copiedElement);

        clickedConversation(copiedElement);
        fetchConversationsData(copiedElement);
    }
}


usersElements.forEach(el => {
    el.addEventListener('click', function () {
        clickedConversation(this);
        fetchConversationsData(this);
    });
});


const backArrow = document.getElementById('back-arrow');

backArrow.addEventListener('click', () => {
    document.getElementById('users-conversations').style.display = 'none';
    document.getElementById('conversations-users').style.display = 'block';
});

const clickedConversation = (el) => {
    document.querySelectorAll('.users-elements').forEach(oel => {
        oel.classList.remove('clicked-conversation');
    });

    el.classList.add('clicked-conversation');

    const mediaQuery = window.matchMedia('(max-width: 901px)');

    const handleMediaQueryChange = (mq) => {
        if (mq.matches) {
            document.getElementById('users-conversations').style.display = 'block';
            document.getElementById('conversations-users').style.display = 'none';
        } else {
            document.getElementById('users-conversations').style.display = 'block';
            document.getElementById('conversations-users').style.display = 'block'; // Assuming the default display should be 'block'
        }
    };

    // Initial check
    handleMediaQueryChange(mediaQuery);

    // Listen for changes in mediaQuery
    mediaQuery.addEventListener('change', handleMediaQueryChange);
};



let participantElementId = '';
const fetchConversationsData = (copiedElement) => {
    conversationMessages.style.bottom = '4rem';
    messageTextarea.style.height = '2.5rem';
    messageTextarea.value = '';

    sendMessageInputBox.displayFlex();
    messageTextarea.focus();
    const participantElement = copiedElement.cloneNode(true);
    participantElementId = participantElement.id;

    const uscd = participantElement.querySelector('.unseen-chat-messages');
    const recipientUsername = participantElement.querySelector('.span2-username');
    recipientUsername.previousElementSibling.style.fontWeight = 'bold';
    const recipientProfileLink = document.createElement('a');
    recipientProfileLink.href = `/${recipientUsername.textContent.trim().replace('@', '')}`;

    uscd?.remove();
    recipientUsername.remove();
    const recipientDp = participantElement.querySelector('img');
    recipientDp.classList.add('recipient-dp', 'flex');
    recipientProfileLink.append(recipientDp);

    participantElement.prepend(recipientProfileLink);
    conversationParticipant.innerHTML = participantElement.innerHTML;


    fetch(`/messages/to/${participantElementId}`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the response data here
            conversationMessages.innerHTML = '';

            if (!data.new) {
                data.messages.forEach(message => {
                    addMessagesToConversation(message);
                });
            }

            conversationMessages.style.scrollBehavior = 'auto';
            bottomOfConversation();
            unreadMessagesStyle();
            unseenChatMessagesFunc(participantElementId);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


messageTextarea.addEventListener('input', () => {
    const message = messageTextarea.value.trim();
    if (message && message.length <= 450) {
        sendMessageBtn.disabled = false;
        sendMessageBtn.style.opacity = '1';
        sendMessageBtn.style.cursor = 'pointer';
    } else {
        sendMessageBtn.disabled = true;
        sendMessageBtn.style.opacity = '.5';
        sendMessageBtn.style.cursor = 'auto';
    }
});

messageTextarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessageBtn.click();
    }
});

function unreadMessagesStyle() {
    const unreadMessages = document.querySelectorAll('.user1_messages');
    unreadMessages.forEach(message => {
        if (!message.classList.contains('seen-message')) {
            message.style.backgroundColor = '#dfdfff05';
        }
    });
}


const addMessagesToConversation = (message) => {
    const newMessage = document.createElement('div');
    const newMessageText = document.createElement('p');
    const newMessageTimestamp = document.createElement('p');
    const timestamp = document.createElement('span');
    const seen = document.createElement('span');
    newMessageTimestamp.append(timestamp, seen);

    if (message.author === participantElementId) {
        newMessage.classList.add('user1_messages', 'newMessage');
    } else if (message.author === currentUserId) {
        newMessage.classList.add('user2_messages', 'newMessage');
    }

    seen.setAttribute('id', message.timestamp);
    seen.classList.add('seen-ms');
    newMessageTimestamp.classList.add('message-timestamp');
    newMessageText.classList.add('message-text');
    newMessageText.innerHTML = message.message.trim().replace(/\n/g, "<br>");


    // Function for readability
    timestamp.textContent = setTimeForMessages(message.timestamp);

    if (newMessage.classList.contains('user2_messages')) {
        if (message.seen) {
            seen.textContent = ' · Seen';
        } else {
            seen.textContent = ' · Unseen';
        }
    } else if (newMessage.classList.contains('user1_messages')) {
        if (message.seen) {
            newMessage.classList.add('seen-message');
        } else {
            newObserver.observe(seen);
        }
    }

    newMessage.append(newMessageText, newMessageTimestamp);
    conversationMessages.append(newMessage);
}


const bottomOfConversation = () => {
    conversationMessages.scrollTop = conversationMessages.scrollHeight;
}

const checkScroll = (mcb) => {
    const matched = Math.abs(mcb.scrollHeight - mcb.scrollTop - mcb.clientHeight);

    if (matched < 2) {
        lastOfConversation.displayNone();
    } else {
        lastOfConversation.displayFlex();
    }
}

const autoResizeMessageDiv = (textarea) => {
    autoResize(textarea);

    conversationMessages.style.bottom = sendMessageInputBox.offsetHeight + 'px';
    lastOfConversation.style.bottom = sendMessageInputBox.offsetHeight + 16 + 'px';
}

unseenChatMessages.forEach(el => {
    startedConversations.prepend(el.parentElement);
});

function unseenChatMessagesFunc(id) {
    const unseenChatMessages = document.querySelectorAll('.unseen-chat-messages');

    unseenChatMessages.forEach(el => {
        if (el.parentElement && el.parentElement.id === id) {
            el.parentElement.classList.remove('b-h');
            el.remove();
        }
    });
}

function unseenMessageChatFunc(id) {
    const unseenMessageChat = document.getElementById(id);
    if (unseenMessageChat) {
        const alreadyExist = unseenMessageChat.querySelector('.unseen-chat-messages');

        startedConversations.prepend(unseenMessageChat);
        const sameId = participantElementId ? id !== participantElementId : true;

        if (!alreadyExist && sameId) {
            unseenMessageChat.innerHTML += `<div class="unseen-chat-messages"></div>`;
            unseenMessageChat.classList.add('b-h');
        }
    }
}

if (conversationMessages.innerHTML.trim() === '') {
    conversationMessages.innerHTML = `<div class="pnfm">Messages will appear here!</div>`;
}

const setTimeForMessages = (timestamp) => {
    const date = new Date(timestamp);
    const messageTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const messageDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const messageDay = date.toLocaleDateString('en-US', { weekday: 'short' });
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (new Date().getFullYear() > year) {
        return `${year} - ${messageDate}, ${messageTime}`;
    } else if (new Date().getMonth() >= month && new Date().getDate() >= day + 7) {
        return `${messageDate}, ${messageTime}`;
    } else if (new Date().getDate() > day + 1) {
        return `${messageDay}, ${messageTime}`;
    } else if (new Date().getDate() === day + 1) {
        return `Yesterday, ${messageTime}`;
    } else {
        return `${messageTime}`;
    }
}


const newObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const message = entry.target;
            seenMessages(message);
            observer.unobserve(entry.target);
        }
    });
}, { once: true });





















