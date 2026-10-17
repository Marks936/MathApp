// --- Переменные игры ---
let currentQuestion = 1;
const totalQuestions = 20;
let score = 0;
let currentAnswer = 0;
let currentDifficulty = 'easy';
let isAnswering = false; // Защита от двойных кликов

// --- Элементы DOM ---
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionCounter = document.getElementById('question-counter');
const mathProblem = document.getElementById('math-problem');
const answerInput = document.getElementById('answer-input');
const feedback = document.getElementById('feedback');
const finalScoreText = document.getElementById('final-score-text');
const resultEmoji = document.getElementById('result-emoji');
const submitBtn = document.getElementById('submit-btn');

// --- 1. Начало игры ---
function startGame(difficulty) {
    currentDifficulty = difficulty;
    currentQuestion = 1;
    score = 0;
    isAnswering = false;
    
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    nextQuestion();
}

// --- 2. Генерация примера ---
function nextQuestion() {
    isAnswering = false;
    answerInput.value = '';
    answerInput.disabled = false;
    submitBtn.disabled = false;
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // Автофокус только если это не мобильный телефон (на телефоне это вызывает клавиатуру и дергает экран)
    if (window.innerWidth > 768) {
        answerInput.focus();
    }

    questionCounter.textContent = `Вопрос ${currentQuestion} из ${totalQuestions}`;

    const isMultiplication = Math.random() < 0.5;
    let num1, num2;

    if (currentDifficulty === 'easy') {
        num1 = Math.floor(Math.random() * 9) + 2; 
        num2 = Math.floor(Math.random() * 9) + 2; 
    } else if (currentDifficulty === 'medium') {
        num1 = Math.floor(Math.random() * 15) + 5; 
        num2 = Math.floor(Math.random() * 10) + 2; 
    } else {
        num1 = Math.floor(Math.random() * 40) + 10; 
        num2 = Math.floor(Math.random() * 20) + 5;  
    }

    if (isMultiplication) {
        currentAnswer = num1 * num2;
        mathProblem.textContent = `${num1} × ${num2} = ?`;
    } else {
        currentAnswer = num1;
        let product = num1 * num2;
        mathProblem.textContent = `${product} ÷ ${num2} = ?`;
    }
}

// --- 3. Проверка ответа ---
function checkAnswer() {
    if (isAnswering) return; // Если уже проверяем, игнорируем клик
    
    const userAnswer = parseInt(answerInput.value);

    // Если поле пустое, подсвечиваем его красным и выходим
    if (isNaN(userAnswer)) {
        answerInput.style.borderColor = '#e74c3c';
        setTimeout(() => answerInput.style.borderColor = '#bdc3c7', 500);
        return;
    }

    isAnswering = true;
    answerInput.disabled = true;
    submitBtn.disabled = true;

    if (userAnswer === currentAnswer) {
        score++;
        feedback.textContent = "Верно! 🎉";
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = `Ошибка! Правильно: ${currentAnswer}`;
        feedback.className = 'feedback wrong';
    }

    // Задержка 1.5 секунды перед следующим вопросом
    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            nextQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

// --- 4. Конец игры ---
function endGame() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Прикольные сообщения в зависимости от результата
    if (percentage === 100) {
        resultEmoji.textContent = "🏆";
        finalScoreText.textContent = `Идеально! 100% (${score} из ${totalQuestions})`;
    } else if (percentage >= 80) {
        resultEmoji.textContent = "🌟";
        finalScoreText.textContent = `Отлично! ${percentage}% (${score} из ${totalQuestions})`;
    } else if (percentage >= 50) {
        resultEmoji.textContent = "👍";
        finalScoreText.textContent = `Хорошо! ${percentage}% (${score} из ${totalQuestions})`;
    } else {
        resultEmoji.textContent = "💪";
        finalScoreText.textContent = `Не сдавайся! ${percentage}% (${score} из ${totalQuestions})`;
    }
}

// --- 5. Играть снова ---
function goHome() {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// --- 6. Отправка по кнопке Enter ---
answerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});