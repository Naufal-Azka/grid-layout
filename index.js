const modalForm = document.getElementById("modal-form")
const addButton = document.getElementById("add-btn")
const closeButtonForm = document.getElementById("close-btn-form")

const modalCharacter = document.getElementById("modal-Character")
const closeButtonCharacter = document.getElementById('close-btn-character')

let isEditMode = false
let editIndex = null

function openModalCharacter(event) {
    const index = event.currentTarget.getAttribute('data-index')
    const character = characterLists[index]

    modalCharacter.innerHTML = `
        <div class="modal-content">
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <h1 style="color: white;">${character.name} | ${'★'.repeat(character.rarity)}</h1>
                <span id="close-btn-character" class="close-btn">&times;</span>
            </div>
            <div class="character-detail">
                <div class="left-container">
                    <img src="${character.image}" alt="${character.name}" class="char-img" style="border: 1px solid #FFC800; width: 90%; height: 80%; object-fit: cover;">
                    <p style="color: white;margin-block: 1rem;">${character.description}</p>
                </div>
                <div class="right-container">
                    <table style="border: 1px solid #FFC800; width: 100%; background-color: #FFC80033; color: rgb(255, 255, 255); padding: .5rem 1rem;">
                        <tbody>
                            <tr style="font-size: 12px;">
                                <td>Class</td>
                                <td style="padding-left: 1rem; display: flex; gap: .2rem;">
                                    <img src="${character.classe.classImage}" alt="">
                                    <p style="align-self: center;">${character.classe.className}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>Branch</td>
                                <td style="padding-left: 1rem; display: flex; gap: .2rem;">
                                    <img src="${character.branch.branchImage}" alt="">
                                    <p style="align-self: center;">${character.branch.branchName}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>Faction</td>
                                <td style="padding-left: 1rem; display: flex; gap: .2rem;">
                                    <img src="${character.faction.factionImage}" alt="">
                                    <p style="align-self: center;">${character.faction.factionName}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>Position</td>
                                <td style="padding-left: 1rem;">Lorem.</td>
                            </tr>
                            <tr>
                                <td>Tags</td>
                                <td style="padding-left: 1rem;">Lorem, ipsum dolor.</td>
                            </tr>
                            <tr>
                                <td>Trait</td>
                                <td style="padding-left: 1rem;">Lorem ipsum dolor sit amet.</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="edit-delete-container" style="margin-top: 1rem;">
                        <button onclick="editCharacter(${index})" style="cursor: pointer; width: 5rem;">
                            <img src="src/edit.svg" alt="" width="30">
                        </button>
                        <button onclick="deleteCharacter(${index})" style="cursor: pointer; width: 5rem;">
                            <img src="src/delete.svg" alt="" width="30">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalCharacter.style.display = "block"
    document.body.style.overflow = "hidden";

    document.getElementById('close-btn-character').onclick = closeModalCharacter
}

function closeModalCharacter() {
    modalCharacter.style.display = "none"
    document.body.style.overflow = "auto";
}

function openModal() {
    modalForm.style.display = "block"
    document.body.style.overflow = "hidden";
}
function closeModal() {
    modalForm.style.display = "none"
    document.body.style.overflow = "auto";
    discardForm()
    isEditMode = false
    editIndex = null
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
            option.value = `${faction.image}|${faction.name}`; // Store multiple values separated by a pipe
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
            option.value = `${classes.image}|${classes.name}`; // Store multiple values separated by a pipe
            option.textContent = classes.name
            classLists.appendChild(option)
        })
    })

let branchLists = document.getElementById('branch-lists')
classLists.addEventListener("change", function() {
    var selectedClass = classLists.value.split('|')[1]; // Retrieve the class name

    branchLists.innerHTML = '<option value="" disabled selected>Select Branch</option>';

    fetch('src/branchOptions.json')
        .then(response => response.json())
        .then(data => {
            if (data[selectedClass]) {
                data[selectedClass].forEach(function(branch) {
                    var option = document.createElement("option");
                    option.value = `${branch.image}|${branch.name}`; // Store multiple values separated by a pipe
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
    const operatorImage = document.getElementById('image-preview').src;
    const operatorFaction = document.getElementById('faction-lists').value; // Retrieve the faction image
    const operatorClass = document.getElementById('class-lists').value; // Retrieve the class image
    const operatorBranch = document.getElementById('branch-lists').value; // Retrieve the branch image
    const operatorRarity = document.getElementById('operator-rarity').value;
    const operatorDesc = document.getElementById('operator-desc').value;

    let newCharacter = {
        name: operatorName,
        image: operatorImage,
        faction: {
            factionName: operatorFaction.split('|')[1],
            factionImage: operatorFaction.split('|')[0]
        },
        classe: {
            className: operatorClass.split('|')[1],
            classImage: operatorClass.split('|')[0]
        },
        branch: {
            branchName: operatorBranch.split('|')[1],
            branchImage: operatorBranch.split('|')[0]
        },
        rarity: operatorRarity,
        description: operatorDesc
    }

    if (isEditMode) {
        characterLists[editIndex] = newCharacter
    } else {
        characterLists.push(newCharacter)
    }

    saveCharacter()
    discardForm()
    displayCharacter()

    modalForm.style.display = "none"
}

modalForm.addEventListener('submit', addCharacter)

const gridContainer = document.getElementById('character-list')
function displayCharacter() {
    gridContainer.innerHTML = ''
    characterLists.forEach((character, index) => {
        const newDiv = document.createElement('div')

        newDiv.className = 'character-container'
        newDiv.setAttribute('data-index', index)
        newDiv.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="char-img">
            <div class="top-container" style="display: flex; flex-direction: row; gap: 0;">
                <div class="left-container">
                    <img src="${character.classe.classImage}" alt="" width="24">
                    <img src="${character.branch.branchImage}" alt="" width="20">
                </div>
                <div class="right-container">
                    <p style="color: yellow; font-size: 10px; text-align: center; align-self: center;">${'★'.repeat(character.rarity)}</p>
                </div>
            </div>
            <div class="bottom-container" style="display: flex; flex-direction: row;">
                <img src="${character.faction.factionImage}" alt="" width="64">
                <p style="color: white; font-size: 10px; text-align: right; align-self: self-start;">${character.name}</p>
            </div>
            <button onclick="editCharacter(${index})" style="cursor: pointer; width: 5rem;">
                <img src="src/edit.svg" alt="" width="30">
            </button>
            <button onclick="deleteCharacter(${index})" style="cursor: pointer; width: 5rem;">
                <img src="src/delete.svg" alt="" width="30">
            </button>
        `;

        newDiv.addEventListener('click', openModalCharacter)
        gridContainer.appendChild(newDiv)
    })
}

function editCharacter(index) {
    const character = characterLists[index]

    document.getElementById('operator-name').value = character.name
    document.getElementById('image-preview').src = character.image
    document.getElementById('image-preview').style.display = 'block'
    document.getElementById('faction-lists').value = `${character.faction}|${character.faction}` // Set the faction value
    document.getElementById('class-lists').value = `${character.class}|${character.class}` // Set the class value

    const event = new Event('change')
    document.getElementById('class-lists').dispatchEvent(event)

    document.getElementById('branch-lists').value = `${character.branch}|${character.branch}` // Set the branch value
    document.getElementById('operator-rarity').value = character.rarity
    document.getElementById('operator-desc').value = character.description

    isEditMode = true
    editIndex = index

    closeModalCharacter()
    openModal()
}

function deleteCharacter(index) {
    characterLists.splice(index, 1)
    saveCharacter()
    displayCharacter()

    modalCharacter.style.display = "none"
    document.body.style.overflow = "visible";
}

document.addEventListener('DOMContentLoaded', () => {
    displayCharacter()
})

