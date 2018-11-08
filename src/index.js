document.addEventListener('DOMContentLoaded', () => {

  let dogData = []
  // let dogsString = []
  const dogBarDiv = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  const filterBtn = document.querySelector('#good-dog-filter')

  fetch(`http://localhost:3000/pups`)
  .then(obj => obj.json())
  .then(parsedJSON => {
    dogData = parsedJSON
    dogData.forEach((dog) => {
      dogBarDiv.innerHTML += createDog(dog)}
    )
  })

  createDog = (dog) => {
    return `<span data-id = ${dog.id}>${dog.name}</span>`
  }

  let id
  let clickedDog
  let goodOrBad

  dogBarDiv.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      id = e.target.dataset.id
      clickedDog = dogData.filter(dog => dog.id == id)[0]
      if (clickedDog.isGoodDog) {
        goodOrBad = 'Good Dog!'
      }
      else {
        goodOrBad = 'Bad Dog!'
      }
      dogInfo.innerHTML =
      `
      <img src=${clickedDog.image}>
      <h2>${clickedDog.name}</h2>
      <button class = "goodBad" data-id = ${id}>${goodOrBad}</button>
      `
    }
  })


  dogInfo.addEventListener('click', (e) => {
    // debugger
    if (e.target.className == "goodBad") {
      if (clickedDog.isGoodDog) {
        e.target.innerText = 'Bad Dog!'
      }
      else if (!clickedDog.isGoodDog) {
        e.target.innerText = 'Good Dog!'
      }

      let dogIndex = dogData.findIndex(dog => {return dog.id == id})
      notIsGoodDog = !dogData[dogIndex].isGoodDog
      dogData[dogIndex].isGoodDog = notIsGoodDog
      // console.log(dogData)
      // debugger
      fetch(`http://localhost:3000/pups/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'isGoodDog': clickedDog.isGoodDog
        })
      })

      if (e.target.className = "goodBad") {
        goodDogs = dogData.filter(dog => dog.isGoodDog === true)
        goodDogsString = goodDogs.map(dog => createDog(dog)).join('')
        if (filterBtn.className === "on") {
          dogBarDiv.innerHTML = goodDogsString
        }
      }
    }
  })

  let goodDogs = []
  let goodDogsString = []

  filterBtn.addEventListener('click', (e) => {
    // debugger
    if (e.target.className === "off") {
      e.target.innerText = "Filter good dogs: ON"
      e.target.className = "on"
      goodDogs = dogData.filter(dog => dog.isGoodDog === true)
      goodDogsString = goodDogs.map(dog => createDog(dog)).join('')
      console.log(goodDogsString)
      dogBarDiv.innerHTML = goodDogsString
      // debugger
      // console.log(goodDogs)
    }
    else if (e.target.className === "on") {
      e.target.innerText = "Filter good dogs: OFF"
      e.target.className = "off"
      let dogsString = dogData.map(dog => createDog(dog)).join('')
      console.log(dogsString)
      dogBarDiv.innerHTML = dogsString
    }
  })



})

function functionName() {

}
