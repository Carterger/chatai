const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');
const themeToggle = document.getElementById('theme-toggle');
const clearChat = document.getElementById('clear-chat');

// Твой ключ от Gemini API
const GEMINI_API_KEY = 'AIzaSyDWuWas7-ZZRRJBLSG1QdAL0k_NSw8Pp2s'; // Замени на свой ключ

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
    addMessage('Gemini думает...', 'thinking');
    userInput.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text || 'Gemini не ответил.';

        chatBox.removeChild(chatBox.lastChild); // Удаляем "Gemini думает..."
        addMessage(aiResponse, 'ai');
    } catch (error) {
        chatBox.removeChild(chatBox.lastChild);
        addMessage(`Ошибка: ${error.message}`, 'ai');
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
    if (e.key === 'Enter') sendMessage(e);
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker зарегистрирован'))
        .catch(error => console.error('Ошибка:', error));
}
