const contentContainer = document.getElementById('content-container');
const contentHeader = document.getElementById('content-header');

let lastScrollTop = 0;

function trackScroll() {
    const currentScroll = contentContainer.scrollTop;
    if (currentScroll > lastScrollTop) {
        // Scroll down
        contentHeader.style.top = '-100%';
    } else {
        // Scroll up
        contentHeader.style.top = '0';
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}

contentContainer.addEventListener('scroll', trackScroll);