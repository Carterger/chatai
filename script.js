const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Твой токен от Hugging Face
const HF_TOKEN = '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'; // Замени на свой токен

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

    // Получаем ответ от Mistral
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
                    max_new_tokens: 100, // Ограничение длины ответа
                    temperature: 0.7,    // Контроль креативности (0.5-1.0)
                    top_p: 0.9           // Фильтр вероятностей
                }
            })
        });

        const data = await response.json();

        // Проверяем, есть ли ответ
        if (data && data.generated_text) {
            return data.generated_text;
        } else {
            return "Извини, Mistral не ответил. Попробуй еще раз!";
        }
    } catch (error) {
        console.error('Ошибка:', error);
        return "Ошибка подключения к Mistral. Проверь токен или интернет.";
    }
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
