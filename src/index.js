document.addEventListener("DOMContentLoaded", function() {
  let allDogs = []
  const dogBar = document.getElementById('dog-bar')
  const fullDogInfo = document.getElementById('dog-info')
  const dogFilterButton = document.getElementById('good-dog-filter')

  fetch('http://localhost:3000/pups')
    .then(responseObj => responseObj.json())
    .then(jsonDogs => {
      allDogs = jsonDogs
      dogBar.innerHTML = renderAllDogs(jsonDogs)
    })

  dogBar.addEventListener('click', (event) => {
    if (event.target.dataset.id !== undefined) {
      let foundDog = allDogs.find((dog) => dog.id == event.target.dataset.id)
      fullDogInfo.innerHTML = renderFullDog(foundDog)
    }
  })

  fullDogInfo.addEventListener('click', (event) => {
    if (event.target.dataset.id !== undefined) {
      let foundDog = allDogs.find((dog) => dog.id == event.target.dataset.id)
      flipButton(foundDog, event)
      patchDogBehaviorToDb(foundDog, event)
    }
  })

  dogFilterButton.addEventListener('click', (event) => {
    if (event.target.innerText === "Filter good dogs: OFF") {
      event.target.innerText = "Filter good dogs: ON"
      let filteredDogs = allDogs.filter(dog => dog.isGoodDog == true)
      dogBar.innerHTML = renderAllDogs(filteredDogs)
    } else if (event.target.innerText === "Filter good dogs: ON") {
      event.target.innerText = "Filter good dogs: OFF"
      dogBar.innerHTML = renderAllDogs(allDogs)
    }
    fullDogInfo.innerHTML = ""
  })

  function patchDogBehaviorToDb(dog) {
    fetch(`http://localhost:3000/pups/${dog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        "isGoodDog": `${dog.isGoodDog}`
      })
    })
  }

  function flipButton(dog, event) {
    if (dog.isGoodDog){
      dog.isGoodDog = false
      event.target.innerText = "Bad Dog!"
    } else if (!dog.isGoodDog) {
      dog.isGoodDog = true
      event.target.innerText = "Good Dog!"
    }
  }

}) // End of DOMContentLoaded

function renderAllDogs(dogsArray) {
  return dogsArray.map((dog) => {
    return `
      <span data-id="${dog.id}">${dog.name}</span>
    `
  }).join("")
}

function renderFullDog(dog) {
  let buttonText = "Good Dog!"
  if (!dog.isGoodDog) {
    buttonText = "Bad Dog!"
  }
  return `
    <div class="dog-card"">
      <img src="${dog.image}">
      <h2>Name: ${dog.name}</h2>
      <button data-id="${dog.id}">${buttonText}</button>
    </div>
  `
}
