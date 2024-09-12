const bb = document.getElementById('cdb');
const cb = document.getElementById('cancel-btn');
const db = document.getElementById('delete-btn');
const eb = document.getElementById('source-div');

// Display None
const cancelBtn = () => {
    bb.displayNone().innerHTML = '';
}

// Delete Post
const deletePost = (id) => {
    const element = document.getElementById(id).querySelector('.more-options');
    element.displayFlex().nextElementSibling.displayNone();

    bb.displayFlex().style.opacity = '1';
    bb.innerHTML = eb.innerHTML;

    const deleteBtn = document.getElementById('delete-btn');

    return deleteBtn.addEventListener('click', () => {
        confirmDeletion(id);
        cancelBtn();
    });
}


const confirmDeletion = (id) => {

    fetch(`/post/${id}/delete`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not okay.');
            }
        })
        .then(data => {
            document.getElementById(id).remove();
            delMessage(data.message);
        })
        .catch(error => console.error('Error:', error));
}


let count = 99;

// Post Delete Flash Message 
function delMessage(message) {
    const newDiv = document.createElement('div');
    newDiv.textContent = message;
    newDiv.classList.add('flash-message', 'flex', 'red-bc');
    newDiv.style.zIndex = ++count;
    document.body.prepend(newDiv);
}


// Go To Post
const goToPost = (username, id) => {
    window.location.href = `/${username}/posts/${id}`;
}


// Cache for efficiency
const setUnit = (dtms, year, month) => {
    if (new Date().getFullYear() > year) {
        return `${month}, ${year}`;
    } else if (dtms >= (2 * 24 * 60 * 60)) {
        return `${month}`;
    } else if (dtms >= (24 * 60 * 60)) {
        return Math.floor(dtms / (24 * 60 * 60)) + 'd';
    } else if (dtms >= (60 * 60)) {
        return Math.floor(dtms / (60 * 60)) + 'h';
    } else if (dtms >= (60)) {
        return Math.floor(dtms / (60)) + 'm';
    } else {
        return dtms + 's';
    }
};

const postDuration = document.querySelectorAll('.duration');

postDuration.forEach(el => {
    const timestamp = Math.floor((Date.now() - parseInt(el.innerHTML)) / 1000);
    const date = new Date(parseInt(el.innerHTML));
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Function for readability
    el.innerHTML = setUnit(timestamp, year, month);
});


// More Options
const moreHoriz = document.querySelectorAll('.more-options');

const moreOptions = (el) => {
    const mainElement = el.parentElement;
    bb.displayFlex().style.opacity = '0';

    moreHoriz.forEach(oels => {
        if (oels === mainElement) {
            mainElement.displayNone().nextElementSibling.displayFlex();
        } else {
            oels.displayFlex().nextElementSibling.displayNone();
        }
    });

    bb.addEventListener('click', () => {
        mainElement.displayFlex().nextElementSibling.displayNone();
        cancelBtn();
    });
}

// To Display Element Flex
HTMLElement.prototype.displayFlex = function () {
    this.style.display = "flex";
    return this; // Allow method chaining
};

// To Display Element None
HTMLElement.prototype.displayNone = function () {
    this.style.display = "none";
    return this; // Allow method chaining
};


function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 2 + "px";
}


function addStylings(btn) {
    const likesCount = btn.nextElementSibling;
    const countNum = parseInt(likesCount.textContent.trim());
    if (btn.classList.contains('navigation-icons')) {
        btn.classList.remove('navigation-icons');
        btn.classList.add('favorite-btn');

        likesCount.textContent = countNum + 1;
    } else {
        btn.classList.add('navigation-icons');
        btn.classList.remove('favorite-btn');

        likesCount.textContent = countNum - 1;
    }
}

function bookmarkStyling(btn) {
    if (btn.classList.contains('navigation-icons')) {
        btn.classList.remove('navigation-icons');
        btn.classList.add('bookmark-btn');
    } else {
        btn.classList.add('navigation-icons');
        btn.classList.remove('bookmark-btn');
    }
}


// Add To Liked Post
function addToFavoritePost(btn, user_id, post_id) {
    addStylings(btn);

    const data = {
        user_id: user_id,
        post_id: post_id
    }

    fetch(`/user/like/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not okay.');
            }
        })
        .catch(error => console.error('Error:', error));
}


// Add To Bookmark Post
function bookmarkPost(btn, user_id, post_id) {
    bookmarkStyling(btn);

    const data = {
        user_id: user_id,
        post_id: post_id
    }

    fetch(`/user/bookmark/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not okay.');
            }
        })
        .catch(error => console.error('Error:', error));
}


function externalEffects(id, followee, message) {
    const element = document.getElementById(id).querySelector('.more-options');
    element.displayFlex().nextElementSibling.displayNone();
    cancelBtn();
    profileUpdate(message, followee);
}

function profileUpdate(message, followee) {
    const postTabs = document.querySelectorAll('.follow-unfollow');
    const pb = document.getElementById('profile-follow-btn');
    const fcAdd = document.getElementById('fc-add');

    if (message === 'followed') {
        postTabs.forEach(el => {
            if (el.classList.contains(followee)) {
                el.querySelector('.options-icons').textContent = 'cancel';
                el.querySelector('.options-text').textContent = `Unfollow @${followee}`;
            }

        });

    } else if (message === 'unfollowed') {
        postTabs.forEach(el => {
            if (el.classList.contains(followee)) {
                el.querySelector('.options-icons').textContent = 'add_circle';
                el.querySelector('.options-text').textContent = `Follow @${followee}`;
            }
        });
    }

    if (pb && fcAdd) {
        const count = parseInt(fcAdd.textContent.trim());
        fcAdd.textContent = message === 'followed' ? count + 1 : count - 1;
        pb.textContent = message === 'followed' ? 'Following' : 'Follow';
        btnBc(message);
    }
}


// Add To Followed User
function followBtn(follower_id, followee_id, post_id) {
    const data = {
        follower_id: follower_id,
        followee_id: followee_id
    };

    fetch(`/user/follow-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not okay.');
            }
        })
        .then(data => {
            post_id ? externalEffects(post_id, data.followee, data.message) : profileUpdate(data.message, data.followee);
        })
        .catch(error => console.error('Error:', error));
}