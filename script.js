// --- Переменные игры ---
let currentQuestion = 1;
const totalQuestions = 20;
let score = 0;
let currentAnswer = 0;
let currentDifficulty = 'easy';
let isAnswering = false; 

// --- Элементы DOM ---
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const adminLoginScreen = document.getElementById('admin-login-screen');
const adminPanelScreen = document.getElementById('admin-panel-screen');

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
    
    // Автофокус на Android (чтобы клавиатура не закрывалась)
    setTimeout(() => {
        answerInput.focus();
    }, 100);

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
    if (isAnswering) return; 
    
    const userAnswer = parseInt(answerInput.value);

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

    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            nextQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

// --- 4. Конец игры и сохранение результата ---
function endGame() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // Прячем клавиатуру на телефоне при окончании игры
    answerInput.blur();

    const percentage = Math.round((score / totalQuestions) * 100);
    
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

    saveResultToAdmin(currentDifficulty, score, percentage);
}

// --- 5. Играть снова ---
function goHome() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    startScreen.classList.add('active');
    answerInput.blur(); // Скрываем клавиатуру, если она открыта
}

// --- 6. Отправка по кнопке Enter (и на виртуальной клавиатуре тоже) ---
answerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkAnswer();
});

// ==========================================
// === СИСТЕМА АДМИНИСТРАТОРА (LOCAL STORAGE) ===
// ==========================================

function showAdminLogin() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    adminLoginScreen.classList.add('active');
    document.getElementById('admin-user').value = '';
    document.getElementById('admin-pass').value = '';
    document.getElementById('login-error').textContent = '';
}

function checkAdminLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    const errorText = document.getElementById('login-error');

    if (user === 'admin' && pass === '00010') {
        errorText.textContent = '';
        loadAdminPanel();
    } else {
        errorText.textContent = 'Неверный логин или пароль!';
    }
}

function loadAdminPanel() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    adminPanelScreen.classList.add('active');

    const resultsList = document.getElementById('admin-results-list');
    resultsList.innerHTML = ''; 

    let history = JSON.parse(localStorage.getItem('mathAppHistory')) || [];

    if (history.length === 0) {
        resultsList.innerHTML = '<p style="text-align:center; color:#7f8c8d;">Пока нет результатов.</p>';
        return;
    }

    history.slice().reverse().forEach(record => {
        const div = document.createElement('div');
        div.className = 'result-item';
        
        let diffRus = record.difficulty === 'easy' ? 'Легко 🌱' : record.difficulty === 'medium' ? 'Средне ⚡' : 'Сложно 🔥';

        div.innerHTML = `
            <span class="result-date">${record.date}</span>
            <span class="result-details">Сложность: ${diffRus} | Счёт: ${record.score}/20 (${record.percentage}%)</span>
        `;
        resultsList.appendChild(div);
    });
}

function saveResultToAdmin(difficulty, score, percentage) {
    let history = JSON.parse(localStorage.getItem('mathAppHistory')) || [];
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});

    history.push({
        date: dateStr,
        difficulty: difficulty,
        score: score,
        percentage: percentage
    });

    localStorage.setItem('mathAppHistory', JSON.stringify(history));
}

function clearAdminResults() {
    if (confirm('Ты уверен, что хочешь удалить всю историю результатов?')) {
        localStorage.removeItem('mathAppHistory');
        loadAdminPanel(); 
    }
}