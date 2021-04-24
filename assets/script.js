// Defining variables for HTML elements
const answerButtons = document.getElementsByClassName("qbtn");
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
let scoresLiEl = document.getElementsByTagName("li");
let scoresList = document.getElementById("scores-list");

// Tracks the number of questions the user has answered
let questionsCompleted = 0;
// Used as the index to generate each question
let questionIndex = 0;
// For 60 second timer
let timeLeft = 60;
// Stores highscores once pulled and parsed from localStorage
let scores = [];

// Array of objects that serves as all possible questions for the quiz - includes correct answer and all possible answers
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

// Creates the quiz timer - references the timeLeft variable defined above. If the timer hits zero, it will launch the end game screen, and if the user reaches the end of the questions, the timer will stop at the current time
function buildTimer() {
  let timer = setInterval(function() {
      timerDisplay.innerHTML='00:'+timeLeft;
      timeLeft--;
      if (timeLeft < 0) {
          clearInterval(timer);
          endGame();
      } else if (questionsCompleted === 4) {
        clearInterval(timer);
      }
  }, 1000);
}

// Generates the quiz
function buildQuiz () {
  // Hides the score and start containers from the starting page and un-hides the container housing the questions
  scoresEl.setAttribute("style", "display: none;");
  startEl.setAttribute("style", "display: none;");
  questionContainer.setAttribute("style", "display: flex;");

  // Setting the text of the question and answer buttons by indexing the arrray of questions above, using the question counter as the index
  questionEl.textContent = questions[questionIndex].question;
  choice1Button.textContent = questions[questionIndex].answers.a;
  choice2Button.textContent = questions[questionIndex].answers.b;
  choice3Button.textContent = questions[questionIndex].answers.c;
  choice4Button.textContent = questions[questionIndex].answers.d;

  // Looping through the entire collection of answer buttons and assigning an event listener to each that will evaluate the user's answer
  for (i = 0; i < answerButtons.length; i++) {
      answerButtons[i].addEventListener("click", evaluateAnswer);
  }
}

// Evaluates user's answer choice
function evaluateAnswer (event) {
  questionsCompleted++;
  // User's choice is defined as the click event's target
  let choice = event.target;
  // If the button clicked matches the button assigned to the correct answer in the questions array, then the appropriate message will be displayed or time will be removed from the timer
  if (choice === questions[questionIndex].correctAnswer) {
      results.textContent = "Correct!";
  } else {
      results.textContent = "Wrong!";
      // If the timer has 15 seconds available, 15 seconds is subtracted
      if (timeLeft > 15){
          timeLeft -= 15;
      // Otherwise the timer is set to zero
      } else {
          timeLeft = 0;
      }
  }
  // If the question index is less than the items in the questions array and the timer is still has time on it, the question index will be incremented and the buildQuiz function will run again with a new question based on the index value. Currently hardcoded but breaks when I use questions.length?
  if (questionIndex < 3 && timeLeft > 0){ 
      questionIndex++;
      buildQuiz();
      // If the user makes it to the end of the questions list, the end game screen will appear
  } else if (questionIndex === 3){
      endGame();
  }
}

// End game
function endGame () {
  // Hides the question container and displays the scores and end screen container
  scoresEl.setAttribute("style", "display: flex;");
  questionContainer.setAttribute("style", "display: none;");
  endScreen.setAttribute("style", "display: flex;");
  // Listens for the user to click the reset button, which will refresh the page. 
  resetButton.addEventListener("click", function () {
    location.reload();
      return false;
  });
  // If the time left at the end of the game is below zero, set the time left to zero
  if (timeLeft < 0) {
      timeLeft = 0;
  };
  // Kicks off storage of scores in local storage
  scoresGenerator();
}

// Handles local storage of scores
function scoresGenerator () {
  // Listens for click on submit button for scores
  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Your score has been submitted! Click 'Reset Game' to play again.")
    // Stores the score information as an object
    let scoresObj = {
      initials: intialsInput.value,
      score: timeLeft
    };
    // Pushes the score object into an empty array
    scores.push(scoresObj);
    // Stringifies said array and pushes it into local storage
    localStorage.setItem("scores", JSON.stringify(scores));
  });
}

// Shows highscores
function displayScores () {
  // Sorts the array of scores by the value of the score in descending order
  scores.sort((a, b) => (a.score > b.score) ? -1 : 1);
  // If there are currently no <li> elements in the scoresLiEl array... 
  if (scoresLiEl.length < 1) {
    // Generate a <li> that displays the stored initials: score if the array is less than 10 items long and appends it to the scoresList container
    if (scores.length < 10) {
      for (i = 0; i < scores.length; i++) {
        let newLi = document.createElement("li");
        newLi.textContent = `${scores[i].initials} : ${scores[i].score}`;
        scoresList.appendChild(newLi);
      }
      // If the array is more than 10 items long, loops through only 10 times to limit the number of <li>s that can be generated
    } else {
      for (i = 0; i < 10; i++) {
        let newLi = document.createElement("li");
        newLi.textContent = `${scores[i].initials} : ${scores[i].score}`;
        scoresList.appendChild(newLi);
    }
  }
  }
}

// Kicks off everything
function init () {
    // Pulls scored stores out of local storage, parses them, and pushes them into an empty scores array
    scores = JSON.parse(localStorage.getItem("scores"));
    if (scores === null) {
      scores = [];
    }
    // Hides the question and end screen container, adds an event listener to the highscores button that will allow user to display the scores, and launches the start button 
    questionContainer.setAttribute("style", "display: none;");
    endScreen.setAttribute("style", "display: none;");
    scoresButton.addEventListener("click", function () {
      displayScores();
    });
    startButton.addEventListener("click", function () {
        buildQuiz();
        buildTimer();
    });
}

init();