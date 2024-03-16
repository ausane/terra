const editForm = document.getElementById('edit-form');
const ep = document.getElementById('edit-profile');
const links = document.querySelectorAll(".ps-links");
const psCt = document.getElementById('ps-ct');

// Edit Profile
const editProfile = () => {
    ep.displayFlex();
    fetchProfileUpdateForm();
}

if (currentUserUsername) {
    if (currentUserUsername === ProfileUserUsername) {
        nip.classList.add('navitem-profile');
        ntp.classList.add('text-profile');
    } else {
        nip.classList.remove('navitem-profile');
        ntp.classList.remove('text-profile');
        btnBc(Followed);
    }
} else {
    ep.remove();
}

function btnBc(message) {
    const pb = document.getElementById('profile-follow-btn');

    pb.textContent = message === 'followed' ? 'Following' : 'Follow';
    pb.style.color = message === 'followed' ? 'inherit' : '#000000';
    pb.style.backgroundColor = message === 'followed' ? 'inherit' : '#ffffff';
}

function validateInput(input) {
    const ct = input.previousElementSibling;
    const ctc = ct.querySelector('.count-characters');
    ctc.textContent = input.value.length;
}


function fetchProfileUpdateForm() {
    fetch('/user/profile/update-form', {
        method: 'POST'
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Network response was not okay.');
            }
        })
        .then(data => {
            ep.innerHTML = data;
            addJSAfterLoad();
        })
        .catch(error => console.error('Error:', error));
}


function addJSAfterLoad() {
    const editForm = document.getElementById('edit-form');
    const updateImage = document.getElementById('u-i-btn');
    const editPicture = document.getElementById('edit-picture');
    const cpLabel = document.getElementById('cp-label');
    const epClsBtn = document.getElementById('cls-ef-btn');
    const bio = document.getElementById('bio');
    const select = document.getElementById('picture');
    const customSelect = document.getElementById('custom-select');

    // Cancel Edit
    epClsBtn.addEventListener('click', () => {
        ep.displayNone();
        editForm.remove();
    });

    // Create custom options from select options
    for (const option of select.options) {
        const customOption = document.createElement('div');
        customOption.classList.add('custom-option');
        customOption.dataset.value = option.value;
        customOption.innerHTML = `<img src="/images/${option.value}" alt="${option.text}">`;
        customOption.addEventListener('click', function () {
            select.value = this.dataset.value;
            updateSelectedOption();
            editPicture.src = `/images/${option.value}`;
            customSelect.displayNone();
            cpLabel.displayNone();
            dis = false;
        });
        customSelect.appendChild(customOption);
    }

    // Update selected option appearance
    function updateSelectedOption() {
        const selectedValue = select.value || pp;
        const customOptions = customSelect.querySelectorAll('.custom-option');
        customOptions.forEach(function (option) {
            if (option.dataset.value === selectedValue) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    // Initialize selected option appearance
    updateSelectedOption();

    let dis = false;
    updateImage.addEventListener('click', () => {
        if (dis) {
            customSelect.displayNone();
            cpLabel.displayNone();
            dis = false;
        } else {
            customSelect.displayFlex();
            cpLabel.displayFlex();
            dis = true;
        }
    });

    autoResize(bio);
}


// Get the current path
const currentPath = window.location.pathname;
const pathSegments = currentPath.split('/');

// Get the second path segment
const secondPath = pathSegments[2];

for (const link of links) {
    if (link.getAttribute("href") === currentPath) {
        psCt.textContent = secondPath ? secondPath : 'posts';
        link.classList.add('sps-link');
        break;
    }
}