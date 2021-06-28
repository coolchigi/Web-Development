let counterId = document.getElementById("counter-id")
let saveId = document.getElementById("prevEn")
let counter = 0
function increment(){
    counter++
    counterId.innerText = counter
}

function reset(){
    counterId.textContent = 0
    counter = 0
    saveId.innerText = "Previous Entries:"
}

function save(){
    counterId.textContent = 0
    let space = "  "
    let placeholder = space + counter +  " - " 
   
    saveId.textContent += placeholder
}