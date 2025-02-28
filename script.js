const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Твой токен от Hugging Face
const HF_TOKEN = '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'; // Убедись, что он правильный

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
        const response = await fetch('https://api-inference.huggingface.co/models/mixtral-8x7b-instruct-v0.1', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: message,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    top_p: 0.9
                }
            })
        });

        // Выводим статус ответа в консоль
        console.log('Статус ответа:', response.status);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Ответ от API:', data); // Выводим весь ответ для отладки

        if (data && data.generated_text) {
            return data.generated_text;
        } else {
            return "Mistral не вернул ответ. Возможно, проблема с моделью.";
        }
    } catch (error) {
        console.error('Подробная ошибка:', error);
        return `Ошибка подключения: ${error.message}. Проверь консоль (F12) для деталей.`;
    }
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
