// variables to keep track of quiz state
var currentQuestion  = 0;
var time = 60;
var timerId;

// variables to reference DOM elements
var questionsEl= document.getElementById("question");
var timerEl = document.getElementById("timer");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

function startQuiz() {
  // hide start screen
  var startScreen = document.getElementById("start-screen");
  startScreen.setAttribute("class", "hide");

  // un-hide questions section
  questionsEl.removeAttribute("class");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currntQuestion = questions[currentQuestion];

  // update title with current question
  var title = document.getElementById("question-title");
  console.log(currntQuestion);
  console.log(questions[currntQuestion]);
  title.textContent = currntQuestion.question;
  

  // clear out any old question choices
  choicesEl.innerHTML = ""

  // loop over choices
  console.log(currntQuestion.choices);
  currntQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    console.log(choice, i);
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // attach click event listener to each choice
    choiceNode.onclick = questionClick;

    // display on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  // check if user guessed wrong
  var currntQuestion = questions[currentQuestion]
  console.log(this.value);
  if (this.value !== currntQuestion.answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerEl.textContent = time;

    feedbackEl.textContent = "Wrong!";
  } else {

    feedbackEl.textContent = "Correct!";
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestion++;

  // check if we've run out of questions
  if (currentQuestion === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // show final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
