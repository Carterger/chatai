document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButtons = document.querySelectorAll('.theme-button');
    const body = document.body;
    const chatMessagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    // --- База знаний (простые правила для ответов бота) --- (как в предыдущем примере)
    const knowledgeBase = { /* ... ваша база знаний ... */ };

    // --- Переключение тем ---
    themeToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme; // Получаем тему из data-theme атрибута
            body.classList.remove('light-theme', 'dark-theme'); // Убираем все классы тем
            body.classList.add(`${theme}-theme`); // Добавляем нужный класс темы

            // Убираем класс 'active' со всех кнопок и добавляем на текущую
            themeToggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Сохранение темы в localStorage (необязательно, но полезно)
            localStorage.setItem('theme', theme);
        });
    });

    // --- Загрузка сохраненной темы из localStorage при загрузке страницы ---
    const savedTheme = localStorage.getItem('theme') || 'dark'; // По умолчанию темная тема, если ничего не сохранено
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

    // --- Отправка сообщений (как в предыдущем примере) ---
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault();
        }
    });

    function sendMessage() { /* ... функция sendMessage из предыдущего примера ... */ }
});
