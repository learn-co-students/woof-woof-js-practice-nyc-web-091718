let dogBar;
let dogSummary;
allPups= []; //global variable to store all Dogs
selectedDog = {};
document.addEventListener('DOMContentLoaded', function() {
  dogBar = document.querySelector('#dog-bar');
  dogInfo= document.querySelector('#dog-info');
  dogBar.addEventListener('click', handleDogBarClick);
  document.querySelector('#good-dog-filter').addEventListener('click', filterGoodDogs)

  fetchAllDogs();

  function filterGoodDogs(event){
    if(event.target.innerText.split(' ').slice(-1)[0] == 'OFF') {
      document.querySelector('#good-dog-filter').innerText = "Filter good dogs: ON";

      let goodDogs = allPups.filter(function(dog) {
        return dog.isGoodDog;
      })
      addPupsToPage(goodDogs);
    } else {
      addPupsToPage(allPups);
    }
  }

  function fetchAllDogs() {
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(pups => {
      allPups = pups
      addPupsToPage(allPups)
    }) //dogs => allDogs = dogs
  }

  function addPupsToPage(pups) {
    dogBar.innerHTML = "" //clears out dogs before rendering again
    pups.forEach(function(dog) {
      putSinglePupToPage(dog);
    })
  }

  function putSinglePupToPage(pup) {
    dogBar.innerHTML += `<span class='dog-div'data-id=${pup.id}>${pup.name}</span>`;
  }

  function handleDogBarClick(event) {
    if(event.target.className === 'dog-div') {
      let dog = allPups.find(function(dog) {
        return dog.id == event.target.dataset.id;
      })
      displayDog(dog)
    }
  }

  function displayDog(dog) {
    selectedDog = dog;
    dogInfo.innerHTML =
    `
    <img src=${dog.image}>
      <h2>${dog.name}</h2>
      `
        if (dog.isGood) {
          dogInfo.innerHTML += `<button>Good Dog!</button>`
        } else {
          dogInfo.innerHTML += `<button>Good Dog!</button>`
        }
        dogInfo.querySelector('button').addEventListener('click', function(){
          console.log(dog)
          handleGoodnessToggle(dog);
        })
    }

    function handleGoodnessToggle() {
      // if(selectedDog.isGood) {
      //   selectedDog.isGood = !selectedDog.isGoodDog //or false
      // } else {
      //   selectedDog.isGoodDog = selectedDog.isGoodDog
      // }
      selectedDog.isGood = !selectedDog.isGoodDog
      displayDog(selectedDog);
      //should run displayDog function and hit the if statment to change button
      updateDogOnServer(selectedDog);
    }

    function updateDogOnServer(dog) {
      let data = {
        isGoodDog: dog.isGoodDog
      }

      fetch(`http://localhost:3000/pups/${dog.id}`,{
        method:'PATCH',
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify(data)
      })
    }

})
