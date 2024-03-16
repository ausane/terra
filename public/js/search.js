const search = document.getElementById('search');
const mtcdtc = document.getElementById('matched-tc');
const peopleTab = document.getElementById('people-tab');
const postTab = document.getElementById('post-tab');
const searchPeople = document.getElementById('search-people');
const searchPost = document.getElementById('search-post');
const quSearch = document.getElementById('qu-search');
const searchCtgs = document.getElementById('search-ctgs');


search.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();

    if (searchTerm) {
        fetch(`/search-people`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm: searchTerm })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not okay.');
                }
            })
            .then(data => {
                addSerachedHtml(data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        addSerachedHtml(null);
    }
});


function addSerachedHtml(data) {
    if (data) {
        quSearch.displayFlex().innerHTML = '';
    } else {
        quSearch.displayNone().innerHTML = '';
        return;
    }

    data.forEach(element => {
        const mc = document.createElement('div');
        const pd = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');
        const image = document.createElement('img');
        const anchor = document.createElement('a');

        mc.classList.add('st-mc');
        pd.classList.add('st-pd');
        span1.classList.add('st-span1');
        span2.classList.add('st-span2');
        span3.classList.add('st-span3');
        image.classList.add('picture');

        span1.textContent = element.name ? element.name : element.username;
        span2.textContent = `@${element.username}`;
        span3.textContent = element.bio;
        anchor.href = `/${element.username}`;

        image.src = `/images/${element.picture}`;

        pd.append(span1, span2, span3);
        mc.append(image, pd)
        anchor.append(mc)
        quSearch.append(anchor);
    });
}


function peopleTabFunction() {
    searchPeople.displayFlex();
    searchPost.displayNone();
    peopleTab.classList.add('ctfs');
    postTab.classList.remove('ctfs');
};

function postTabFunction() {
    searchPost.displayFlex();
    searchPeople.displayNone();
    postTab.classList.add('ctfs');
    peopleTab.classList.remove('ctfs');
};


const urlParams = new URLSearchParams(window.location.search);
const paramValue = urlParams.get('q');

highlightText(paramValue);

if (paramValue) {
    searchCtgs.style.height = '2rem';
} else {
    searchCtgs.style.height = '0px';
}


function highlightText(searchText) {
    const regex = new RegExp(searchText, 'gi');
    const preserve = document.querySelectorAll('.preserve');

    // Loop through each element
    preserve.forEach(function (element) {
        // Get the element's text content
        const text = element.textContent;

        // Replace all occurrences of the search text with a highlighted version
        const newText = text.replace(regex, function (match) {
            return '<span class="highlight">' + match + '</span>';
        });

        // Update the element's HTML with the highlighted text
        element.innerHTML = newText;
    });
}

