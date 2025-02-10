const modalForm = document.getElementById("modal-form")
const addButton = document.getElementById("add-btn")
const closeButtonForm = document.getElementById("close-btn-form")

// const modalCharacter = document.getElementById("modal-Character")
// const characterCard = document.getElementById('character-container')
// const closeButtonCharacter = document.getElementById('close-btn-character')

// function openModalCharacter() {
//     modalCharacter.style.display = "block"
// }
// function closeModalCharacter() {
//     modalCharacter.style.display = "none"
// }
// characterCard.onclick = openModalCharacter
// closeButtonCharacter.onclick = closeModalCharacter

function openModal() {
    modalForm.style.display = "block"
    document.body.style.overflow = "hidden";
}
function closeModal() {
    modalForm.style.display = "none"
    document.body.style.overflow = "auto";
    discardForm()
}


closeButtonForm.onclick = closeModal
closeButtonForm.ontouchstart = closeModal

addButton.onclick = openModal
addButton.ontouchstart = openModal

const imageInput = document.querySelector("input[id='operator-image']")
const imagePreview = document.getElementById("image-preview")

imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
    }
});

function discardForm() {
    imageInput.value = ''
    imagePreview.src = '#'
    imagePreview.style.display = 'none'

    document.getElementById('operator-form').reset()
}

let factionLists = document.getElementById('faction-lists')
fetch('src/factionOptions.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(function (faction) {
            let option = document.createElement('option')
            option.value = faction.image;
            option.textContent = faction.name;
            factionLists.appendChild(option)
        })
    })

let classLists = document.getElementById('class-lists')
fetch('src/classOptions.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(function (classes) {
            let option = document.createElement('option')
            option.value = classes.image;
            option.textContent = classes.name
            classLists.appendChild(option)
        })
    })

let branchLists = document.getElementById('branch-lists')
classLists.addEventListener("change", function() {
    var selectedClass = classLists.value;

    branchLists.innerHTML = '<option value="" disabled selected>Select Branch</option>';

    fetch('src/branchOptions.json')
        .then(response => response.json())
        .then(data => {
            if (data[selectedClass]) {
                data[selectedClass].forEach(function(branch) {
                    var option = document.createElement("option");
                    option.value = branch.image;
                    option.textContent = branch.name;
                    branchLists.appendChild(option);
                });
            }
        });
})

let characterLists = JSON.parse(localStorage.getItem('characterLists')) || [];

function saveCharacter() {
    localStorage.setItem('characterLists', JSON.stringify(characterLists))
}

function addCharacter(event) {
    event.preventDefault()

    const operatorName = document.getElementById('operator-name').value;
    const operatorImage = document.getElementById('operator-image').value;
    const operatorFaction = document.getElementById('faction-lists').value;
    const operatorClass = document.getElementById('class-lists').value;
    const operatorBranch = document.getElementById('branch-lists').value;
    const operatorRarity = document.getElementById('operator-rarity').value;
    const operatorDesc = document.getElementById('operator-desc').value;

    let newCharacter = {
        name: operatorName,
        image: operatorImage,
        faction: operatorFaction,
        class: operatorClass,
        branch: operatorBranch,
        rarity: operatorRarity,
        description: operatorDesc
    }
    
    characterLists.push(newCharacter)
    saveCharacter();

    document.getElementById('operator-form').reset()
    modalForm.style.display = "none"
}

modalForm.addEventListener('submit', addCharacter)

function deleteCharacter(index) {
    characterLists.splice(index, 1)
    saveCharacter()
}

document.addEventListener('DOMContentLoaded', () => {
    // deleteCharacter()
})