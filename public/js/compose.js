const formToComposePost = document.getElementById('form-to-compose-post');
const btnToSubmitPost = document.getElementById('btn-to-submit-post');
const postTextarea = document.getElementById('content');
const composePostDiv = document.getElementById('compose-post-div');
const composePostCls = document.querySelector('.compose-post-close');
const sourceComposeDiv = document.getElementById('source-compose-div');

postTextarea.addEventListener('input', () => {
    const value = postTextarea.value.trim();
    const maxLength = 450;

    if (value && value.length < maxLength) {
        btnToSubmitPost.disabled = false;
        postTextarea.style.opacity = '1';
    } else {
        btnToSubmitPost.disabled = true;
        postTextarea.style.opacity = '.5';
    }
});


// To Compose Post Btn
const composePostBtn = (btn, id, username) => {
    const post = composePostDiv.querySelector('.post');

    if (post) post.remove();
    postTextarea.value = null;
    sourceComposeDiv.displayFlex();

    if (btn.id === 'compose-btn') {
        formToComposePost.setAttribute('action', '/post/submit');
        autoResize(postTextarea);
        postTextarea.focus();
    } else if (btn.classList.contains('direct-comment-btn')) {
        formToComposePost.setAttribute('action', `/${username}/post/${id}/comment/submit`);
        const parentPost = document.getElementById(id);
        const copiedDiv = parentPost.cloneNode(true);
        removeCopiedDiv(copiedDiv);
        postTextarea.focus();
    } else if (btn.classList.contains('edit-post-btn')) {
        formToComposePost.setAttribute('action', `/post/${id}/update?_method=PUT`);
        btn.parentElement.displayNone().previousElementSibling.displayFlex();

        // To Get Value of Post Content
        const post = document.getElementById(id);
        const content = post.querySelector('.preserve');
        postTextarea.value = content.textContent.replace(/<br>/g, '\n').trim();
        autoResize(postTextarea);
        postTextarea.focus();
        cancelBtn();
    }
}

const removeCopiedDiv = (copiedDiv) => {
    copiedDiv.querySelector('.more-options').remove();
    copiedDiv.querySelector('.action-options').remove();
    copiedDiv.querySelector('.navigation-icons-div').remove();
    copiedDiv.querySelector('.post-main-content').style.fontSize = 'smaller';
    copiedDiv.classList.add('remove-unness-elements');

    copiedDiv.querySelector('.threads')?.remove();

    const thread = document.createElement('div');
    const dpDiv = copiedDiv.querySelector('.dp-div');

    thread.classList.add('post-thread');
    dpDiv.classList.add('image-div-element');

    dpDiv.append(thread);

    composePostDiv.insertBefore(copiedDiv, composePostDiv.firstElementChild.nextElementSibling);
}

const closeBtn = () => {
    sourceComposeDiv.displayNone();
}

// Mutation Observer
const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.attributeName === 'disabled') {
            if (btnToSubmitPost.disabled) {
                btnToSubmitPost.style.cursor = 'auto';
            } else {
                btnToSubmitPost.style.cursor = 'pointer';
            }
        }
    }
});

observer.observe(btnToSubmitPost, { attributes: true });