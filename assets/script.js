const answerButtons = document.getElementsByClassName("btn");
const questionEl = document.getElementById("question-text"); 
const questionContainer = document.getElementById("questions")
const choice1Button = document.getElementById("choice1");
const choice2Button = document.getElementById("choice2");
const choice3Button = document.getElementById("choice3");
const choice4Button = document.getElementById("choice4");
const results = document.getElementById("results");
const startButton = document.getElementById("startButton");
const startEl = document.getElementById("startGame");
const timerDisplay = document.getElementById("timerDisplay");
const endScreen = document.getElementById("endgame");
const resetButton = document.getElementById("reset");
const intialsInput = document.getElementById("initials");
const scoresButton = document.getElementById("scores");
const scoresEl = document.getElementById("scores-container");
const submitBtn = document.getElementById("submitForm");
let scoresList = document.getElementById("scores-list");
let questionCounter = 0;
let timeLeft = 60;
let scores = [];

const questions = [
    {
      question: "What is Buffy's middle name?",
      answers: {
        a: "Maria",
        b: "Amy",
        c: "Ann",
        d: "Louise"
      },
      correctAnswer: choice3Button
    },
    {
      question: "When Buffy meets Angel for the first time, who does he say he is?",
      answers: {
        a: "A friend",
        b: "An enemy",
        c: "A Vampire",
        d: "A Stalker"
      },
      correctAnswer: choice1Button
    },
    {
      question: "Who is the Big Bad of season one?",
      answers: {
        a: "The Hellmouth",
        b: "The First",
        c: "Spike",
        d: "The Master"
      },
      correctAnswer: choice4Button
    },
    {
      question: "How many episodes of Buffy were made in total?",
      answers: {
        a: "96",
        b: "144",
        c: "100",
        d: "201"
      },
      correctAnswer: choice2Button
    }
  ];

function timer() {
  let timer = setInterval(function() {
      timerDisplay.innerHTML='00:'+timeLeft;
      timeLeft--;
      if (timeLeft < 0) {
          clearInterval(timer);
          endGame();
      } else if (questionCounter === 3) {
        clearInterval(timer);
      }
  }, 1000);
}
  
function buildQuiz () {
    startEl.setAttribute("style", "display: none;");
    questionContainer.setAttribute("style", "display: flex;");

    questionEl.textContent = questions[questionCounter].question;
    choice1Button.textContent = questions[questionCounter].answers.a;
    choice2Button.textContent = questions[questionCounter].answers.b;
    choice3Button.textContent = questions[questionCounter].answers.c;
    choice4Button.textContent = questions[questionCounter].answers.d;

    for (i = 0; i < answerButtons.length; i++) {
        answerButtons[i].addEventListener("click", evaluateAnswer);
    }
}

function evaluateAnswer (event) {
    let choice = event.target;

    if (choice === questions[questionCounter].correctAnswer) {
        results.textContent = "Correct!";
    } else {
        results.textContent = "Wrong!";
        if (timeLeft > 15){
            timeLeft -= 15;
        } else {
            timeLeft = 0;
        }
    }
    if (questionCounter < 3 && timeLeft > 0){ 
        questionCounter++;
        buildQuiz();
    } else if (questionCounter === 3){
        endGame();
    }
}

function endGame () {
    questionContainer.setAttribute("style", "display: none;");
    endScreen.setAttribute("style", "display: flex;");
    resetButton.addEventListener("click", function () {
      location.reload();
        return false;
    });
    if (timeLeft < 0) {
        timeLeft = 0;
    };
    scoresGenerator();
    }

function scoresGenerator () {
  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresObj = {
      initials: intialsInput.value,
      score: timeLeft
    };
    scores.push(scoresObj);
    localStorage.setItem("scores", JSON.stringify(scores));
  });
}

function displayScores () {
  for (i = 0; i < scores.length; i++) {
    let newLi = document.createElement("li");
    newLi.textContent = `${scores[i].initials} : ${scores[i].score}`;
    scoresList.appendChild(newLi);
  }
  scoresButton.removeEventListener("click", function () {
    displayScores();
});
}

function init () {
    scores = JSON.parse(localStorage.getItem("scores"));
    if (scores === null) {
      scores = [];
    }
    questionContainer.setAttribute("style", "display: none;");
    endScreen.setAttribute("style", "display: none;");
    scoresButton.addEventListener("click", function () {
      displayScores();
    });
    startButton.addEventListener("click", function () {
        buildQuiz();
        timer();
    });
}

init();