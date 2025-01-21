
const currentChampionsList = document.querySelector("#current-champions-list")
const form = document.querySelector("#update-fighter")
const fighterPhoto = document.querySelector("#fighterPhoto")
const fighterDetails = document.querySelector("#fighter-details")
const championArray = []
const selectedChampionName = fighterDetails.querySelector("#name span")
const selectedChampionAge = fighterDetails.querySelector("#age span")
const selectedChampionWeightClass = fighterDetails.querySelector("#weightClass span")
const selectedChampionWeight = fighterDetails.querySelector("#weight span")
const selectedChampionHeight = fighterDetails.querySelector("#height span")
const selectedChampionRecord = fighterDetails.querySelector("#record span")

document.addEventListener("DOMContentLoaded", initiate)

function initiate(){
    // Check if the element exists before proceeding
    if (!currentChampionsList) {
        console.error("Could not find #current-champions-list element.");
        return;
    }

    fetch("http://localhost:3000/UFC_Champions")
    .then(resp => resp.json())
    .then(
        data => {
            data.forEach(element => championArray.push(element))
            championArray.forEach(element => {
                const champion = {
                    name: element.name,
                    age: element.age,
                    weightClass: element.weightClass,
                    weight: element.weight,
                    height: element.height,
                    image: element.image,
                    record: element.record
                }
                //console.log(champion)
                displayChampion(champion)
            });
            form.addEventListener("submit", updateFighterInfo)
        }
    )
}

//callback functions:

function displayChampion(champion){
    const img = document.createElement("img")
    img.src = champion.image
    img.id = champion.weightClass
    currentChampionsList.appendChild(img)
    //img.addEventListener("click", handleClick.bind(champion))
    img.addEventListener("click", () => handleClick(champion))
}


// Callbacks
function handleClick(champion){ //parameter: champion (for alternative code option)
    // Update Detail Main Picture
    //fighterPhoto.querySelector("img").src = this.img
    
    const imgElement = fighterPhoto.querySelector("img");
    //console.log(imgElement)
    imgElement.src = champion.image;
       
    //Create detail info div for this fighter:
    selectedChampionName.textContent =  champion.name //this.name
    selectedChampionAge.textContent = champion.age //this.age
    selectedChampionWeightClass.textContent = champion.weightClass //this.weightClass
    selectedChampionWeight.textContent = champion.weight //this.weight
    selectedChampionHeight.textContent = champion.height //this.height
    selectedChampionRecord.textContent = champion.record //this.record
};

function updateFighterInfo(e){
    e.preventDefault()
    
    //Update DOM "#fighter-detail" section
    selectedChampionName.textContent = form.name.value
    selectedChampionAge.textContent = form.age.value
    selectedChampionHeight.textContent = form.height.value
    selectedChampionRecord.textContent = form.record.value
    //Update DOM "#fighter-photo" section
    fighterPhoto.querySelector("img").src = form.image.value
    //Update DOM "#current-champions-list" corresponding weight class champion image
    document.querySelector(`#current-champions-list img[id=${selectedChampionWeightClass.textContent}]`).src = form.image.value
    
    //patch update to json server:
    const selectedChampion = championArray.find(element => element.weightClass === 
        selectedChampionWeightClass.textContent)
    //console.log(selectedChampion)
    selectedChampion.name = form.name.value
    selectedChampion.age = form.age.value
    selectedChampion.height = form.height.value
    selectedChampion.image = form.image.value
    selectedChampion.record = form.record.value

    //championArray.find(element => element.weightClass === selectedChampionWeightClass.textContent).image = form.image.value

    fetch(`http://localhost:3000/UFC_Champions/${selectedChampion.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(selectedChampion)
      })
      .then(resp => resp.json())
      .then(data =>{
        //console.log(data)
        document.querySelector(`#current-champions-list img[id=${data.weightClass}]`)
        .addEventListener("click", () => handleClick(data))
      })
    
}


/*
original img:
    https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-10/2/TOPURIA_ILIA_L_BELT_10-26.png?itok=MvI4bGIl

text img:
    https://www.elitesports.com/cdn/shop/articles/ilia-topuria---worlds-first-spanish-ufc-champion.png?v=1729777130&width=2048

    https://www.pointspreads.com/wp-content/uploads/2023/06/Ilia-Topuria-1.webp
*/