const rtp = document.getElementById('rtp');
const commentTextarea = document.getElementById('comment');
const btnToSubmitComment = document.getElementById('post-btn');
const formToSubmitComment = document.getElementById('form-to-post');
const arrowBackOfComments = document.getElementById('arrow-back-of-comments');


commentTextarea.addEventListener('focus', () => {
    btnToSubmitComment.classList.add('focused-btn');
    commentTextarea.classList.add('focused-textarea');
    formToSubmitComment.classList.add('focused-form');
});

commentTextarea.addEventListener('blur', () => {
    if (!commentTextarea.value.trim()) {
        btnToSubmitComment.classList.remove('focused-btn');
        commentTextarea.classList.remove('focused-textarea');
        formToSubmitComment.classList.remove('focused-form');
    }
});

commentTextarea.addEventListener('input', () => {
    const value = commentTextarea.value.trim();
    const maxLength = 450;

    if (value && value.length < maxLength) {
        btnToSubmitComment.disabled = false;
        commentTextarea.style.opacity = '1';
        btnToSubmitComment.style.opacity = '1';
        btnToSubmitComment.style.cursor = 'pointer';
    } else {
        btnToSubmitComment.disabled = true;
        commentTextarea.style.opacity = '.5';
        btnToSubmitComment.style.opacity = '.5';
        btnToSubmitComment.style.cursor = 'auto';
    }
});


rtp.addEventListener('click', () => {
    commentTextarea.focus();
});

function bCount() {
    const bNum = document.getElementById('bCount');
    const ibmd = bNum.previousElementSibling.classList.contains('bookmark-btn');
    const num = parseInt(bNum.textContent.trim());

    bNum.textContent = ibmd ? num + 1 : num - 1;
}

window.onload = function () {
    const contentContainer = document.getElementById('content-container');
    const scrollableArea = document.getElementById("ances");
    contentContainer.scrollTop = scrollableArea.offsetHeight;
};


// Get the previous path
// const previousPath = document.referrer;
// arrowBackOfComments.href = previousPath;


