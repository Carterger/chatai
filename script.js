const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');
const themeToggle = document.getElementById('theme-toggle');
const clearChat = document.getElementById('clear-chat');

// Твой ключ от Gemini API.  ЗАМЕНИТЕ ЭТО НА ВАШ РЕАЛЬНЫЙ КЛЮЧ!
const GEMINI_API_KEY = 'AIzaSyDWuWas7-ZZRRJBLSG1QdAL0k_NSw8Pp2s';

function addMessage(message, type = 'ai') {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(e) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    addMessage('Gemini думает...', 'thinking');  // Сообщение о загрузке
    userInput.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!response.ok) {
            // Более подробная обработка ошибок.  Выводим и статус, и текст.
            const errorText = await response.text(); // Пытаемся получить текст ошибки
            throw new Error(`HTTP ошибка: ${response.status} - ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Gemini не ответил.'; // Более надежный доступ к данным

        chatBox.removeChild(chatBox.lastChild); // Удаляем "Gemini думает..."
        addMessage(aiResponse, 'ai');

    } catch (error) {
        console.error("Ошибка при запросе к Gemini:", error); // Логируем ошибку в консоль
        chatBox.removeChild(chatBox.lastChild); // Удаляем "Gemini думает..."
        addMessage(`Ошибка: ${error.message}`, 'ai'); // Показываем сообщение об ошибке пользователю
    }
}

// Переключение темы
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
});

// Очистка чата
clearChat.addEventListener('click', () => {
    chatBox.innerHTML = '';
});

chatForm.addEventListener('submit', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Отправка по Enter, но не Shift+Enter
        sendMessage(e);
    }
});

// Service Worker registration (лучше делать в конце, после определения всех функций)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { // Ждем полной загрузки страницы
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.error('ServiceWorker registration failed: ', err);
            });
    });
}
