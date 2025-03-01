document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButtons = document.querySelectorAll('.theme-option');
    const body = document.body;
    const messageArea = document.getElementById('message-area');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const microphoneButton = document.querySelector('.input-action-button.microphone-button');


    // --- База знаний (простые правила для ответов бота) --- (как в предыдущих примерах)
    const knowledgeBase = { /* ... ваша база знаний ... */ };


    // --- Переключение тем ---
    themeToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            body.classList.remove('light-theme', 'dark-theme');
            body.classList.add(`${theme}-theme`);

            themeToggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            localStorage.setItem('theme', theme);
        });
    });

    const savedTheme = localStorage.getItem('theme') || 'light'; // По умолчанию светлая тема
    body.classList.add(`${savedTheme}-theme`);
    themeToggleButtons.forEach(button => {
        if (button.dataset.theme === savedTheme) {
            button.classList.add('active');
        }
    });


    // --- Открытие/закрытие боковой панели ---
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });


    // --- Отправка сообщений (как в предыдущих примерах) ---
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault();
        }
    });

    function sendMessage() {
        const messageText = messageInput.value.trim().toLowerCase();
        if (messageText !== "") {
            // Сообщение пользователя
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'user-message');
            userMessageDiv.textContent = messageInput.value;
            messageArea.appendChild(userMessageDiv);

            messageInput.value = "";
            messageArea.scrollTop = messageArea.scrollHeight;


            // --- Имитация ответа бота ---
            let botResponse = knowledgeBase[messageText];

            if (!botResponse) {
                botResponse = knowledgeBase["по умолчанию"]; // Ответ по умолчанию
            }


            setTimeout(() => {
                const botMessageDiv = document.createElement('div');
                botMessageDiv.classList.add('message', 'bot-message');
                botMessageDiv.textContent = botResponse;
                messageArea.appendChild(botMessageDiv);
                messageArea.scrollTop = messageArea.scrollHeight;
            }, 500);
        }
    }


    // --- Анимация кнопки микрофона ---
    if (microphoneButton) {
        microphoneButton.addEventListener('click', () => {
            microphoneButton.classList.toggle('active');
            if (microphoneButton.classList.contains('active')) {
                console.log("Голосовой ввод включен (имитация)");
            } else {
                console.log("Голосовой ввод выключен (имитация)");
            }
        });
    }


});
