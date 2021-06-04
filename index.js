let steakDiv = document.querySelector('#menu')
let restaurantName = document.querySelector('#detail h1')
let detailImg = document.querySelector('#imgDetail')
let plates = document.querySelector('#plates')
let steakRating = document.querySelector('#ratings')
let address = document.querySelector('h2')
let ul = document.querySelector('ul')
let form = document.querySelector('#review')
let h3 = document.querySelector('.error')
let averageRating = 0
let countRating = 0
let selectedRestaurantID = 1

form.addEventListener('submit',(e) => addReviews(e))
getSteaks()


function getSteaks(){
    fetch(`http://localhost:3000/Steakhouses`)
    .then(res => res.json())
    .then(steaks => {displaySteaks(steaks)
    renderDetail(steaks[0])
    })
}

function displaySteaks(steaks){
    steaks.forEach(renderRestaurants)
}

function renderRestaurants(steakObj){
    let img = document.createElement('img')
    img.src = steakObj.image
    img.className = "menuItems"
    let h1 = document.createElement('h1')
    h1.textContent = steakObj.name
    let resDiv = document.createElement('div')
    resDiv.append(h1, img)
    img.addEventListener('click',() => renderDetail(steakObj))
    steakDiv.append(resDiv)
}

function renderDetail(steakObj){
    averageRating = 0
    countRating = 0
    ul.innerHTML = ""
    renderReviews(steakObj.id)
    restaurantName.textContent = steakObj.name
    address.textContent = steakObj.address
    detailImg.src = steakObj.image
    plates.textContent = steakObj["known for"]
    steakRating.textContent = steakObj.rating
    selectedRestaurantID = steakObj.id
}

function renderReviews(restaurantID){
    fetch('http://localhost:3000/Reviews')
    .then(res => res.json())
    .then(reviews => reviews.map(item => {
        if (item.resid === restaurantID) {
            renderLi(item)
        }
    }))
}

function addReviews(e){
    e.preventDefault()
    let newReview = e.target.newreview
    let newRating = parseInt(e.target.cars.value)
    let newReviewObj = {comments: newReview.value, rating: newRating}
    if (newReview.value.trim() !== ""){
    renderLi(newReviewObj)
    newReview.value = ""
    h3.style = "display: none"
    fetch('http://localhost:3000/Reviews',{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            ...newReviewObj, resid: selectedRestaurantID
        })
    })
    }
    else {
        h3.style = "display: inline"
    } 
}


function renderLi (item){
    let li = document.createElement('li')
    li.textContent = item.comments
    ul.append(li)
    averageRating += item.rating
    countRating ++
    let average = averageRating / countRating
    let decimal = Math.round(average * 10)/10
    steakRating.textContent = decimal
}