  let allDogs = []
  let badDogs = []
  let currentDog = null;

document.addEventListener("DOMContentLoaded", () => {

  let dogBar = document.getElementById('dog-bar');
  let dogContainer = document.getElementById('dog-summary-container');
  let filter = document.getElementById('good-dog-filter');
  // helper function(s)
    function checkBoy(dog){
      let dogType = null;
      dog.isGoodDog ? dogType = 'Good Dog!' : dogType = 'Bad Dog!'
      return `<img src=${dog.image}>
      <h2>${dog.name}</h2>
      <button>${dogType}</button>`
    }

    const findDog = (eleTargetId) => allDogs.find((dog)=>dog.id==eleTargetId);

  // end helper functions
  // fetch requests
    loadPage();

    function loadPage(){
      fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(json => {
        allDogs = json
        const dogHtml = allDogs.map((dog) => {
          return `
          <span data-id=${dog.id}>${dog.name}</span>
          `
        }).join('');
        dogBar.innerHTML = dogHtml
      })
    }

    function goodOrBad(){
      fetch(`http://localhost:3000/pups/${currentDog.id}`, {
        method: 'PATCH',
          headers:{
            "Content-Type" : "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            isGoodDog: currentDog.isGoodDog
          })
          })
          .then(response => {
            return response.json();
          })
          .then(json => {
          document.getElementById('dog-summary-container').innerHTML = checkBoy(currentDog)
          })
    }

  // end fetch requests
  // add some event listeners
  dogBar.addEventListener('click', () => {
    event.preventDefault();
    let dogObj = findDog(event.target.dataset.id)
    if (dogObj){
      dogContainer.innerHTML = checkBoy(dogObj);
      currentDog = dogObj
    }
  })

  dogContainer.addEventListener('click', () => {
    event.preventDefault();
    if (event.target.type == "submit") {
      currentDog.isGoodDog = !currentDog.isGoodDog
      goodOrBad();
    }
  })

  filter.addEventListener('click', () => {
    if (filter.innerText == "Filter good dogs: OFF"){
      badDogs = allDogs.filter( (dog) => {
        return dog.isGoodDog == true;
      })
        dogHtml = badDogs.map( (dog) => {
          return `
          <span data-id=${dog.id}>${dog.name}</span>
          `
        }).join('');
        dogBar.innerHTML = dogHtml;
        filter.innerText = "Filter good dogs: ON"
    } else if (filter.innerText == "Filter good dogs: ON") {
        loadPage();
        filter.innerText = "Filter good dogs: OFF"
    }
  })
  // end events listeners

})
