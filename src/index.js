// CLICK ON DOGS IN THE DOG BAR TO SEE MORE INFO ABOUT THE GOOD PUPPER

// MORE INFO INCLUDES A DOG PIC, A DOG NAME, AND A DOG BUTTON THAT INDICATES WHETHER IT IS A GOOD DOG OR A BAD DOG

// CLICK ON GOOD DOG/BAD DOG BUTTON IN ORDER TO TOGGLE PUP GOODNESS

// CLICK ON "FILTER GOOD DOGS" BUTTON IN ORDER TO JUST SEE GOOD DOGS OR SEE ALL DOGS IN DOG BAR

document.addEventListener("DOMContentLoaded", function () {
  const dogBar = document.querySelector('#dog-bar')
  let allDogs
  const infoBox = document.querySelector('#dog-info')
  const doggoDiv = document.querySelector('#dog-summary-container')
  const dogFilter = document.querySelector('#good-dog-filter')

  // INITIAL FETCH
  fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(dogData => {
      allDogs = dogData
      showAllDogs()
    }) // end of fetch

  // LISTENERS
  dogBar.addEventListener('click', (event) =>{
     let dogSpans = Array.from(dogBar.children)
     if (dogSpans.includes(event.target)) {
       let dogNum = event.target.dataset.id
       showDogInfo(dogNum)
     } // end of if statement
  }) // end of dogBar listener

  doggoDiv.addEventListener('click', (event) => {
    if (event.target.className == "status-btn"){
      changeDogStatus(event)
    }
  })

  dogFilter.addEventListener('click', (event) => {
    if (dogFilter.innerText.includes("Filter good dogs: ON")) {
      dogFilter.innerText = "Filter good dogs: OFF"
      showAllDogs()
    } else {
      dogFilter.innerText = "Filter good dogs: ON"
      showGoodDogs()
    }
  })

  // The button's text should change from "Filter good dogs: OFF" to "Filter good dogs: ON", or vice versa.
// If the button now says "ON" (meaning the filter is on), then the Dog Bar should only show pups whose isGoodDog attribute is true. If the filter is off, the Dog Bar should show all pups (like normal).



  // FUNCTIONS
   function showDogInfo(dogNum) {
     let dog = allDogs.find(dog => (dog.id == dogNum))
     getDogHtml(dog)
   } // end of showDogInfo

   function updateDog(dog) {
     fetch(`http://localhost:3000/pups/${dog.id}`, {
       method: 'PATCH',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({
         isGoodDog: dog.isGoodDog
       })
     })
   }

   function showAllDogs() {
     dogBar.innerHTML = ""
     allDogs.forEach(dog =>
       dogBar.innerHTML += `
         <span data-id="${dog.id}">${dog.name}</span>
       `
     )
   }

   function showGoodDogs() {
     dogBar.innerHTML = ""
     allDogs.forEach(dog => {
       if (dog.isGoodDog) {
         dogBar.innerHTML += `
           <span data-id="${dog.id}">${dog.name}</span>
          `
       }
     })
   }

   function getDogHtml(dog) {
     let status
     if (dog.isGoodDog) {
       status = "Good Dog!"
     } else {
       status = "Bad Dog!"
     }
     infoBox.innerHTML = `
      <img src=${dog.image}>
      <h2>${dog.name}</h2>
      <button class="status-btn" data-id="${dog.id}">${status}</button>
     `
   } // end of showDog

   function changeDogStatus(event) {
     let dogNum = event.target.dataset.id
     let dog = allDogs.find(dog => (dog.id == dogNum))
     dog.isGoodDog = !dog.isGoodDog
     updateDog(dog)
     getDogHtml(dog)
   }


}) // end of DOMContentLoaded
