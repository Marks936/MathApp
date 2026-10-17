// --- Элементы DOM ---
const loginScreen = document.getElementById('admin-login-screen');
const panelScreen = document.getElementById('admin-panel-screen');

// Проверка логина и пароля
function checkAdminLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    const errorText = document.getElementById('login-error');

    if (user === 'admin' && pass === '00010') {
        errorText.textContent = '';
        loginScreen.classList.remove('active');
        panelScreen.classList.add('active');
        loadAdminPanel();
    } else {
        errorText.textContent = 'Неверный логин или пароль!';
    }
}

// Загрузка и отображение результатов
function loadAdminPanel() {
    const resultsList = document.getElementById('admin-results-list');
    resultsList.innerHTML = ''; 

    let history = JSON.parse(localStorage.getItem('mathAppHistory')) || [];

    if (history.length === 0) {
        resultsList.innerHTML = '<p style="text-align:center; color:#7f8c8d;">Пока нет результатов.</p>';
        return;
    }

    // Показываем последние результаты сверху
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

// Очистка истории
function clearAdminResults() {
    if (confirm('Ты уверен, что хочешь удалить всю историю результатов?')) {
        localStorage.removeItem('mathAppHistory');
        loadAdminPanel(); 
    }
}