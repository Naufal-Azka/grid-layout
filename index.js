const closeButton = document.getElementsByClassName("close-btn")[0]
const modal = document.getElementById("modal")
const addButton = document.getElementById("add-btn")

closeButton.onclick = function () {
    modal.style.display = "none"
}
addButton.onclick = function () {
    modal.style.display = "block"
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
});


let characterLists = JSON.parse(localStorage.getItem('characterLists')) || [];

function saveCharacter() {
    localStorage.setItem('characterLists', JSON.stringify(characterLists))
}

function addCharacter(event) {
    event.preventDefault()

    const operatorName = document.getElementById('operator-name').value;
    const operatorFaction = document.getElementById('faction-lists').value;
    const operatorClass = document.getElementById('class-lists').value;
    const operatorBranch = document.getElementById('branch-lists').value;
    const operatorRarity = document.getElementById('operator-rarity').value;
    const operatorDesc = document.getElementById('operator-desc').value;

    let newCharacter = {
        name: operatorName,
        faction: operatorFaction,
        class: operatorClass,
        branch: operatorBranch,
        rarity: operatorRarity,
        description: operatorDesc
    }
    
    characterLists.push(newCharacter)
    saveCharacter();

    document.getElementById('operator-form').reset()
    modal.style.display = "none"
}