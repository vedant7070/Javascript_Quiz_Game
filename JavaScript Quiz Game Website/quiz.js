const quizContainer = document.getElementById('quiz-container');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const backBtn = document.getElementById('back-btn');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const questionNumberElement = document.getElementById('question-number');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const resultMessageElement = document.getElementById('result-message');
const timerElement = document.getElementById('timer');
const progressElement = document.getElementById('progress');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
const TIME_PER_QUESTION = 15;

async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    if (data.response_code !== 0) throw new Error('Failed to fetch questions');
    questions = data.results.map(q => ({
      question: decodeHTML(q.question),
      correct_answer: decodeHTML(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(decodeHTML),
      all_answers: shuffle([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)])
    }));
    totalQuestionsElement.textContent = questions.length;
  } catch (error) {
    console.error('Error fetching questions:', error);
    alert('Failed to load questions. Please try again later.');
  }
}

function startQuiz() {
  animateTransition(startScreen, quizScreen);
  currentQuestionIndex = 0;
  score = 0;
  scoreElement.textContent = score;
  progressElement.style.width = '0%'; // Reset progress bar
  fetchQuestions().then(() => {
    if (questions.length) displayQuestion();
  });
}

function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }
  const question = questions[currentQuestionIndex];
  questionNumberElement.textContent = currentQuestionIndex + 1;
  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';
  question.all_answers.forEach(answer => {
    const button = document.createElement('button');
    button.className = 'option w-full text-left';
    button.textContent = answer;
    button.addEventListener('click', () => selectAnswer(answer, button));
    optionsElement.appendChild(button);
  });
  updateProgress();
  startTimer();
}

function selectAnswer(selected, button) {
  clearInterval(timer);
  const correct = questions[currentQuestionIndex].correct_answer;
  const isCorrect = selected === correct;
  if (isCorrect) {
    score += 10;
    scoreElement.textContent = score;
    button.classList.add('correct');
    playSound(correctSound);
  } else {
    button.classList.add('incorrect');
    playSound(incorrectSound);
    optionsElement.querySelectorAll('button').forEach(btn => {
      if (btn.textContent === correct) btn.classList.add('correct');
    });
  }
  optionsElement.querySelectorAll('button').forEach(btn => btn.disabled = true);
  nextBtn.classList.remove('hidden');
}

function startTimer() {
  let timeLeft = TIME_PER_QUESTION;
  timerElement.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      selectAnswer(null);
    }
  }, 1000);
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressElement.style.width = `${progress}%`;
}

function endQuiz() {
  animateTransition(quizScreen, resultScreen);
  finalScoreElement.textContent = score;
  resultMessageElement.textContent = score >= 70 ? 'Great job!' : 'Keep practicing!';
  saveScore(score);
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  nextBtn.classList.add('hidden');
  displayQuestion();
});
restartBtn.addEventListener('click', () => {
  animateTransition(resultScreen, startScreen);
});
leaderboardBtn.addEventListener('click', () => {
  animateTransition(resultScreen, leaderboardScreen);
  displayLeaderboard();
});
backBtn.addEventListener('click', () => {
  animateTransition(leaderboardScreen, startScreen);
});