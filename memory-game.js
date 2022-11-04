"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

// const FOUND_MATCH_WAIT_MSECS = 1000;

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let colorOutput = parseInt(document.getElementById("colorOutput").value);

let COLORS = [
  /* "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple", */
];

function randomizeAndCreateColors(colorOutputInput) {
  COLORS = [];

  colorOutput = parseInt(document.getElementById("colorOutput").value);
  for (let index = 0; index < colorOutputInput / 2; index++) {
    COLORS.push(getRandomColor());
  }
  COLORS = COLORS.concat(COLORS);

  return COLORS;
}

let colors = shuffle(randomizeAndCreateColors(colorOutput));

// set points to 0
const scoreLabel = document.getElementById("currentScore");
createCards(colors);
let finishedGameBool = false;
document.getElementById("bestScore").dataset.bestScoreMax = colorOutput;

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

const cardslist = document.getElementById("cardsList");
const cards = document.getElementsByClassName("colorCard");
// let colorShowingCount = cards.toArray().filter(x => x.style.color !== '')
cardslist.addEventListener("click", function (e) {
  handleCardClick(e);
});

// set reset button to work
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function (e) {
  // resets and shuffles all card data colors
  resetGame();
});

function resetGame() {
  colorOutput = parseInt(document.getElementById("colorOutput").value);
  colors = shuffle(randomizeAndCreateColors(colorOutput));
  createCards(colors);

  const currentScore = document.getElementById("currentScore");
  currentScore.value = "0";

  const bestScoreMax =
    document.getElementById("bestScore").dataset.bestScoreMax;
  if (colorOutput !== parseInt(bestScoreMax)) {
    document.getElementById("bestScore").innerText = "0";
    document.getElementById("bestScore").dataset.bestScoreMax = colorOutput;
  }
}

// todo: figure out why score is incrementing if bestScoreMax and cardCountOutput are different
function  checkBestScoreVsCardCountBool() {
  colorOutput = parseInt(document.getElementById("colorOutput").value);
  const bestScoreMax =
    document.getElementById("bestScore").dataset.bestScoreMax;
    return colorOutput === parseInt(bestScoreMax)
}

function checkBestScoreVsCardCount() {
  if (checkBestScoreVsCardCountBool() === false) {
    // display modal
    const modalToggle = document.getElementById("cardCountMisMatchModal");
    var myModal = new bootstrap.Modal(modalToggle, {
      keyboard: false,
    });
    myModal.show(modalToggle);

    resetGame();
  }
}

function createCards(colors, finishedGame) {
  const gameBoard = document.getElementById("game");
  const cardList = document.getElementById("cardsList");
  cardList.innerHTML = "";

  for (let i = 0; i < colors.length; i++) {
    let remainder = (i + 1) % 4 === 0;
    let cardRowDiv = undefined;
    if (i === 0) {
      cardRowDiv = document.createElement("div");
      cardRowDiv.className = "row row-cols-4 py-1";
      cardList.appendChild(cardRowDiv);
    }
    if (!remainder || (remainder && i !== 0)) {
      /* } else { */
      /* const cardRowDiv = document.createElement("div");
      cardRowDiv.className = "row row-cols-4 py-1";
      cardList.appendChild(cardRowDiv); */

      const cardDiv = document.createElement("div");
      cardDiv.className = "colorCard";
      cardDiv.innerText = "Card " + i;
      cardRowDiv = cardList.lastChild;
      cardRowDiv.appendChild(cardDiv);
    }
    /* if (index % 4 === 0) {
      cardList.appendChild(cardRowDiv);
    } */
  }

  const cards = document.getElementsByClassName("colorCard");

  // reset all values
  scoreLabel.textContent = "0";
  Array.from(cards).forEach((x) => (x.dataset.matched = "false"));
  Array.from(cards).forEach((x) => (x.style.backgroundColor = "grey"));

  for (let i in cards) {
    if (!isNaN(i)) {
      // places a color for each card
      cards[i].dataset.color = colors[i];
      cards[i].dataset.matched = false;
    }
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  // sets delegate for card flipping function
  card.target.style.backgroundColor = card.target.dataset.color;
}

/** Flip a card face-down. */

function unFlipCard(cards) {
  // unflip mismatched cards
  setTimeout(() => {
    // pauses second flip so user can see 2nd color
    cards.forEach((card) => (card.style.backgroundColor = "grey"));
  }, "1000");
}

function incrementScore() {
    let scoreVal = parseInt(scoreLabel.innerText);
    scoreVal = scoreVal + 1;
    scoreLabel.innerText = "" + scoreVal;
}
/** Handle clicking on a card: this could be first-card or second-card. */
function handleCardClick(evt) {
  checkBestScoreVsCardCount();
  // if less than 2 cards flipped up, flip up selected card
  let flippedCards = Array.from(cards).filter(
    (x) => x.style.backgroundColor !== "" && x.dataset.matched === "true"
  );
  let unmatchedCards = Array.from(cards).filter(
    (x) => x.style.backgroundColor === "" && x.dataset.matched === "false"
  );
  let unmatchedFlippedCards = Array.from(cards).filter(
    (x) => x.style.backgroundColor !== "" && x.dataset.matched === "false"
  );
  let colorShowingCount = Array.from(unmatchedFlippedCards).filter(
    (x) => x.style.backgroundColor !== "grey"
  ).length;
  let targetClassName = evt.target.className;
  if (targetClassName === "colorCard") {
    if(checkBestScoreVsCardCountBool() === false) {
      resetGame()
      return;
    }
    if (colorShowingCount <= 1 && evt.target.style.backgroundColor === "grey") {
      incrementScore();
      flipCard(evt);

      // re evaluates unflipped and unmatched cards
      unmatchedFlippedCards = Array.from(cards).filter(
        (x) =>
          x.style.backgroundColor !== "grey" && x.dataset.matched === "false"
      );
      // evaluates unmatched flipped cards
      if (unmatchedFlippedCards.length === 2) {
        const cardcolor1 = unmatchedFlippedCards[0].style.backgroundColor;
        const cardcolor2 = unmatchedFlippedCards[1].style.backgroundColor;
        // unflip unmatched cards
        if (cardcolor1 !== cardcolor2) {
          unFlipCard(unmatchedFlippedCards);
        } else {
          // sets matched dataset value to true
          unmatchedFlippedCards.forEach((x) => (x.dataset.matched = "true"));
          unmatchedFlippedCards = Array.from(cards).filter(
            (x) =>
              x.style.backgroundColor !== "grey" &&
              x.dataset.matched === "false"
          );
          flippedCards = Array.from(cards).filter(
            (x) =>
              x.style.backgroundColor !== "" && x.dataset.matched === "true"
          );
          if (flippedCards.length === colorOutput) {
            finishedGameBool = true;

            // set bestscore
            const bestScore = parseInt(
              document.getElementById("bestScore").innerText
            );
            const currentScore = parseInt(
              document.getElementById("currentScore").innerText
            );
            // currentScore = parseInt(scoreLabel.innerText)
            if (currentScore < bestScore || bestScore === 0) {
              document.getElementById("bestScore").innerText =
                currentScore.toString();
            }

            // display modal
            const modalToggle = document.getElementById("exampleModal");
            var myModal = new bootstrap.Modal(modalToggle, {
              keyboard: false,
            });
            myModal.show(modalToggle);
          }
        }
      }
    }
  }
}

document.getElementById("modalClose").addEventListener("click", function () {
  resetGame();
});

document.getElementById("startButton").addEventListener("click", function () {
  resetGame();
});


