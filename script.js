const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Твой ключ от Google Gemini API
const GEMINI_API_KEY = 'AIzaSyDWuWas7-ZZRRJBLSG1QdAL0k_NSw8Pp2s'; // Замени на свой ключ

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.padding = '10px';
    messageDiv.style.background = isUser ? '#007aff' : '#e5e5ea';
    messageDiv.style.color = isUser ? '#fff' : '#000';
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.margin = '5px 0';
    messageDiv.style.textAlign = isUser ? 'right' : 'left';
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';

    const response = await getAIResponse(message);
    addMessage(response);
}

async function getAIResponse(message) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text || "Gemini не ответил.";
    } catch (error) {
        console.error('Ошибка:', error);
        return `Ошибка подключения: ${error.message}`;
    }
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker зарегистрирован'))
        .catch(error => console.error('Ошибка:', error));
}
