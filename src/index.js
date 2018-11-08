document.addEventListener('DOMContentLoaded', () => {
  let allPups = []
  let pupNames = []
const dogBar = document.getElementById('dog-bar')
const displayDog = document.getElementById('dog-info')

  fetch('http://localhost:3000/pups')
    .then((response) => response.json())
    .then((json) => {
      allPups = json
      //render on innerHTML container
      dogBar.innerHTML = renderPupsName(allPups)
    })

    dogBar.addEventListener('click', (event) => {

      for ( key in allPups ) {
        pup = allPups[key]
        console.log(pup)
        console.log(event.target.dataset.id)
        if ( pup.id == event.target.dataset.id ) {
console.log('matched')
          displayDog.innerHTML = renderPupInfo(pup)
          const dogBtn = document.getElementById('button')
            dogBtn.innerText === "true" ? dogBtn.innerText = "Good Boy!" : dogBtn.innerText = "Bad Boy"
        }
      }
    })


displayDog.addEventListener('click', (event) => {
    // event.target.innerText === true ? event.target.innerText = "Good Boy!" : event.target.innerText = "Bad Boy"
  console.log("listening");
 if(event.target.name === "toggle") {
       const foundPup = allPups.find((pup) => {
         return (pup.id == event.target.dataset.id)
 })

 fetch(`http://localhost:3000/pups/${foundPup.id}`,
   {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          "isGoodDog": event.target.innerText === "Bad Boy" ? event.target.innerText = "Good Boy!" : event.target.innerText = "Bad Boy"
        })
    })
}
//only updates the DOM 
}) //end displaylistenerrr

}) //END DOMLISTENER





function renderPupsName(pups) {
  return pups.map((pup) => {
    return `
    <span data-id= ${pup.id}>
  ${pup.name}
    </span>
    `
  }).join(' ')
}

function renderPupInfo(pup) {
  const pupButton = document.getElementById("button");

    return `
    <div data-id= ${pup.id}>
    <img src=${pup.image}>
    <h2>${pup.name}</h2>
    <button id="button" data-id= ${pup.id} name="toggle">${pup.isGoodDog}</button>
    </div>
     `
//      let goodBad = (if (pup.isGoodDog) {
//         pupButton.innerHTML = "Good Dog!"
//     } else {   pupButton.innerHTML = "Bad Dog" })
}
