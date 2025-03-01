document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const chatMessagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // --- База знаний (простые правила для ответов бота) ---
    const knowledgeBase = {
        "привет": "Приветствую! Чем могу помочь?",
        "здравствуй": "И вам здравствуйте! Готов ответить на ваши вопросы.",
        "как дела": "У меня все отлично, спасибо, что спросили! А у вас?",
        "что ты умеешь": "Я простой чат-бот, могу отвечать на вопросы и поддерживать беседу. Пока что в базовом режиме.",
        "пока": "До свидания! Обращайтесь еще.",
        "до встречи": "Всего хорошего!",
        "спасибо": "Не за что! Рад был помочь.",
        "благодарю": "Всегда пожалуйста!",
        "как тебя зовут": "Меня зовут Gemini Chat (пока что просто имя проекта).",
        "кто тебя создал": "Я был создан как учебный проект.",
        // ... добавьте больше вопросов и ответов ...
        "по умолчанию": "Извините, я не совсем понял ваш вопрос. Пожалуйста, перефразируйте." // Ответ по умолчанию, если нет совпадений
    };

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('gray-theme');
        } else if (body.classList.contains('gray-theme')) {
            body.classList.remove('gray-theme');
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
        else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
    });

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault();
        }
    });

    function sendMessage() {
        const messageText = messageInput.value.trim().toLowerCase(); // Получаем текст, убираем пробелы и приводим к нижнему регистру
        if (messageText !== "") {
            // Сообщение пользователя
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'user-message');
            userMessageDiv.textContent = messageInput.value; // Отображаем оригинальный текст (без toLowerCase)
            chatMessagesContainer.appendChild(userMessageDiv);

            messageInput.value = "";
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

            // --- Имитация ответа бота с использованием базы знаний ---
            let botResponse = knowledgeBase[messageText]; // Пытаемся найти ответ в базе знаний по тексту сообщения в нижнем регистре

            if (!botResponse) { // Если не нашли в базе знаний
                botResponse = knowledgeBase["по умолчанию"]; // Используем ответ по умолчанию
            }

            setTimeout(() => {
                const botMessageDiv = document.createElement('div');
                botMessageDiv.classList.add('message', 'bot-message');
                botMessageDiv.textContent = botResponse;
                chatMessagesContainer.appendChild(botMessageDiv);
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }, 500);
        }
    }
});
