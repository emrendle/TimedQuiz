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
let questionCounter = 0;
let timeLeft = 60;

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

function timer(){
    let timer = setInterval(function(){
        timerDisplay.innerHTML='00:'+timeLeft;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
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
    }
    // push info to object or array here
    // localStorage.setItem("score", timeLeft);
    // localStorage.setItem("initials", input.value);
}

function init () {
    questionContainer.setAttribute("style", "display: none;");
    endScreen.setAttribute("style", "display: none;");
    startButton.addEventListener("click", function () {
        buildQuiz();
        timer();
    });
}

init();

// need to stop the timer when the user reaches the end page without the timer hitting zero (freeze the timer at the current time)
// need to store the value of the input (initials field) as a key-value pair (do this upon clicking submit button? store the time remaining at the same time as clicking submit?)
// empty array(s) or object to push timeleft(score) and initials to in order to JSON.stringify and commit to local storage - then when highscores is clicked the info can be parsed and displayed based on index/object notation