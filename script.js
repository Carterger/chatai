// script.js

// Переключение темы
document.querySelectorAll('.theme-option').forEach(button => {
    button.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.querySelector('.theme-option.active')?.classList.remove('active');
        button.classList.add('active');
    });
});

// Открытие/закрытие боковой панели
document.querySelector('.sidebar-toggle-btn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
});

document.querySelector('.close-sidebar-btn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('open');
});

// Чат-бот
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    addMessage('user-message', userInput);

    // Имитация ответа бота
    setTimeout(() => {
        addMessage('bot-message', 'Вы написали: ' + userInput);
    }, 1000);

    document.getElementById('user-input').value = '';
}

function addMessage(type, text) {
    const messageArea = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + type;
    messageDiv.textContent = text;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('Service Worker registered:', registration))
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}