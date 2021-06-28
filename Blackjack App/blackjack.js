let sum = 0
/*Player should not have blackjack when game starts */
let hasBlackJack = false
let isAlive = false
/*To store the cards */
let cards = []
let player = {
    name: "Chigo",
    chips: 190
}
let playerID = document.getElementById("player-el")
playerID.textContent = player.name + ": $" + player.chips
let sumID = document.getElementById("sum-el")
let cardID = document .getElementById("cards-el")
let messageID = document.getElementById("message-el")

/*This function is called once the game starts */
function renderGame(){
    cardID.textContent = "Cards: "
    for(let i = 0; i < cards.length; i++){
        cardID.textContent += " " + cards[i]

    }
      
    sumID.textContent = "Sum: " + sum
    let message = " "
    if(sum <= 20){
    message = "Do you want to draw a new card 😃"

}else if(sum === 21){
    message = "Yayyy! You've got Blackjack 🎉"
    hasBlackJack = true
}else{
    message = "You're out of the game!"
    isAlive = false
}
    
    messageID.textContent = message
    
}
function startGame(){
    isAlive = true
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()

    sum = firstCard + secondCard
    cards = [firstCard, secondCard]

    renderGame()
    
}

function newCard(){
    /*Player should be allowed to draw a new card if alive and has no blackjack */
    if(isAlive && !hasBlackJack === true){
        let newCard = getRandomCard()
        sum += newCard
    /*To add the new card to the cards array */
        cards.push(newCard)
        renderGame()
    }
    
    
}

function getRandomCard(){
    let randomNumber = Math.floor(Math.random() * 13) + 1
    if(randomNumber ===1){
        return 11
    }else if(randomNumber > 10){
        return 10
    }
    return randomNumber
}

function resetGame(){
    cards = []
    
    sumID.textContent = "Sum: " + ""
    cardID.textContent = "Cards: "
    WelcomeMessage = "Welcome! "
    messageID.textContent = WelcomeMessage
    
}