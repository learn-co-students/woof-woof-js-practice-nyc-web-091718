let allDogs = []
document.addEventListener('DOMContentLoaded', () => {

  const dogBar = document.querySelector('#dog-bar')
  const dogInfoDiv = document.querySelector('#dog-info')
  const dogFilterBtn = document.querySelector('#good-dog-filter')


  fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(dogsJSON => {
    allDogs = dogsJSON
    dogBar.innerHTML = renderDogBar(dogsJSON)
  })

  dogBar.addEventListener('click', (event) => {
    if (event.target.dataset.id) {
      let targetDog = allDogs.find((dog) => {
        return dog.id == event.target.dataset.id
      })
      dogInfoDiv.innerHTML = renderDogInfo(targetDog)
    }

  })

  dogInfoDiv.addEventListener('click', (event) => {

    if (event.target.dataset.action === 'woof') {
      let selectedDog = allDogs.find((dog) => {
        return dog.id == event.target.dataset.id
      })
      if (event.target.innerText === 'Good Dog!') {
         event.target.innerText = 'Bad Dog!'
          selectedDog.isGoodDog = false
      } else if (event.target.innerText === 'Bad Dog!') {
        event.target.innerText = 'Good Dog!'
         selectedDog.isGoodDog = true
      }
      let id = selectedDog.id
      let name = selectedDog.name
      let isGoodDog = selectedDog.isGoodDog
      let image = selectedDog.image


      fetch(`http://localhost:3000/pups/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          name: name,
          isGoodDog: isGoodDog,
          image: image
        })
      })
      .then(response => response.json())
      .then(updatedDog => {
        allDogs[id-1] = updatedDog
        console.log(updatedDog)
      })
    } //end of if statement

  }) // end of dogInfoDiv addEventListener


  dogFilterBtn.addEventListener('click', (event) => {
    console.dir(event.target)
    if (event.target.innerText.includes('Filter good dogs: OFF')) {
      event.target.innerText = 'Filter good dogs: ON'
      let goodDogs = allDogs.filter(goodDogCheck)
      console.log(goodDogs);
      dogBar.innerHTML = renderDogBar(goodDogs)
    } else {
      event.target.innerText = 'Filter good dogs: OFF'
      dogBar.innerHTML = renderDogBar(allDogs)
    }

  }) //end of filter addEventListener


}) // end of DOMContentLoaded

function renderDogBar(dogs){
  return dogs.map((dog) => {
    return `<span data-id="${dog.id}">${dog.name}</span>`
  }).join('')
}

function renderDogInfo(dog){
  return `
    <img src=${dog.image}>
    <h2>${dog.name}</h2>
    <button id="good-dog-btn" data-id="${dog.id}" data-action="woof">Good Dog!</button>
  `
}

function goodDogCheck(dog) {
    return dog.isGoodDog === true;
}
