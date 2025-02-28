const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

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

    const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: message })
    });
    const data = await response.json();
    return data.generated_text || "Извини, я не понял.";
    */
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
