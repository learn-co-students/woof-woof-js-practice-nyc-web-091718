document.addEventListener('DOMContentLoaded', ()=>{
  const barDiv = document.getElementById('dog-bar');
  const infoDiv = document.getElementById('dog-info');
  const filterButton = document.getElementById('good-dog-filter');
  let dogsArray = [];

  // on load fetch
  fetch('http://localhost:3000/pups')
  .then((resp)=>resp.json())
  .then((dogJSON)=>{
    dogsArray = dogJSON;
    barDiv.innerHTML = renderAllDogsBar(dogsArray);
  })

  // event listeners
  barDiv.addEventListener('click', barDivEventHandler);

  infoDiv.addEventListener('click', infoDivEventHandler);

  filterButton.addEventListener('click', filterEventHandler)

  // helper functions
  function renderAllDogsBar(array) {
    return array.map(dog => renderSingleDogBar(dog)).join('');
  }

  function renderSingleDogBar(dog) {
    return `<span id=${dog.id}>${dog.name}</span>`;
  }

  function barDivEventHandler(event) {
    if (event.target.id !== 'dog-bar') {
      let dogIndex = dogsArray.findIndex(dog => dog.id == event.target.id);
      infoDiv.innerHTML = renderDogInfo(dogsArray[dogIndex]);
    }
  }

  function renderDogInfo(dog) {
    return `
    <img src="${dog.image}">
    <h2>${dog.name}</h2>
    <button data-id="${dog.id}">Good Dog!</button>
    `
  }

  function infoDivEventHandler(event) {
    if (event.target.dataset.id != undefined) {
      let dogIndex = dogsArray.findIndex(dog => dog.id == event.target.dataset.id);
      let targetDog = dogsArray[dogIndex];

      if (event.target.innerText === "Good Dog!") {
        targetDog.isGoodDog = true;
        updateDogFetch(targetDog);
      } else if (event.target.innerText === "Bad Dog!") {
        targetDog.isGoodDog = false;
        updateDogFetch(targetDog);
      }
    } // end dataset.id != undefined if stmt
  }

  function updateDogFetch(targetDog) {
    let dogIndex = dogsArray.findIndex(dog => dog.id == targetDog.id);
    fetch(`http://localhost:3000/pups/${targetDog.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        isGoodDog: targetDog.isGoodDog
      })
    })
      .then(resp => resp.json())
      .then(updatedDog => {
        let button = infoDiv.querySelector('button');
        dogsArray[dogIndex] = updatedDog;
        if (updatedDog.isGoodDog === true) {
          button.innerText = "Bad Dog!";
        } else if (updatedDog.isGoodDog === false) {
          button.innerText = "Good Dog!";
        }
      })
  } // end updateDogFetch helper fn

  function filterEventHandler(event) {
    let goodDogsArray = dogsArray.filter(dog => dog.isGoodDog === true);
    if (event.target.innerText === "Filter good dogs: OFF") {
      barDiv.innerHTML = renderAllDogsBar(goodDogsArray);
      event.target.innerText = "Filter good dogs: ON"
    } else if (event.target.innerText === "Filter good dogs: ON") {
      barDiv.innerHTML = renderAllDogsBar(dogsArray);
      event.target.innerText = "Filter good dogs: OFF"
    }
  } // end filterEventHandler helper fn

}) //end DOMContentLoaded event listener
