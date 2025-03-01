const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');
const themeToggle = document.getElementById('theme-toggle');
const clearChat = document.getElementById('clear-chat');
const menuToggle = document.getElementById('menu-toggle');
const navDrawer = document.getElementById('nav-drawer');
const closeDrawerButton = document.getElementById('close-drawer');
const chatList = document.getElementById('chat-list');
const newChatButton = document.getElementById('new-chat-button');
const overlay = document.createElement('div'); // Create the overlay
overlay.classList.add('overlay'); // Add the overlay class
document.body.appendChild(overlay); // Add it to the body


// Твой ключ от Gemini API.  ЗАМЕНИТЕ ЭТО НА ВАШ РЕАЛЬНЫЙ КЛЮЧ!
const GEMINI_API_KEY = 'AIzaSyDWuWas7-ZZRRJBLSG1QdAL0k_NSw8Pp2s';

let currentChatId = null; // Keep track of the currently active chat

function addMessage(message, type = 'ai', chatId = currentChatId) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Save the message to the current chat
    saveMessage(chatId, message, type);
}

async function sendMessage(e) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    addMessage('Gemini думает...', 'thinking');  // Сообщение о загрузке
    userInput.value = '';
    userInput.focus(); // keep focus

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

// Load chats from local storage
function loadChats() {
    const chats = JSON.parse(localStorage.getItem('chats')) || {};
    return chats;
}

// Save chats to local storage
function saveChats(chats) {
    localStorage.setItem('chats', JSON.stringify(chats));
}
// Save a message to a specific chat
function saveMessage(chatId, message, type) {
    const chats = loadChats();
    if (!chats[chatId]) {
        chats[chatId] = [];
    }
    chats[chatId].push({ text: message, type: type });
    saveChats(chats);
    renderChatList(); // Update the chat list display
}

// Create a new chat
function createNewChat() {
    const chatId = Date.now().toString(); // Unique ID based on timestamp
    currentChatId = chatId;
    chatBox.innerHTML = ''; // Clear the chat box
    renderChatList();
    //loadChat(chatId); // No need to load, it's a new chat
    closeDrawer(); // Close after creating
    userInput.focus();

}
// Load and display a specific chat
function loadChat(chatId) {
    const chats = loadChats();
    if (chats[chatId]) {
        currentChatId = chatId;
        chatBox.innerHTML = ''; // Clear current messages
        chats[chatId].forEach(message => {
            addMessage(message.text, message.type, chatId);
        });
        renderChatList(); //update the current chat
        closeDrawer();
        userInput.focus();
    }
}

// Delete a chat
function deleteChat(chatId) {
    const chats = loadChats();
    delete chats[chatId];
    saveChats(chats);
      // If the deleted chat was the current one, start a new chat
    if (currentChatId === chatId) {
        createNewChat(); // This will also clear the chatBox
    } else {
       renderChatList(); // Otherwise, just re-render the list
    }
    closeDrawer();
    userInput.focus();

}

// Render the list of chats in the navigation drawer
function renderChatList() {
    const chats = loadChats();
    chatList.innerHTML = ''; // Clear existing list

    for (const chatId in chats) {
        const listItem = document.createElement('li');
        const chatPreview = chats[chatId].length > 0 ? chats[chatId][0].text : "No messages";
        listItem.textContent = `Chat ${chatId.slice(-4)}: ${chatPreview.substring(0, 20)}${chatPreview.length > 20 ? "..." : ""}`; // Short preview
        listItem.dataset.chatId = chatId;
        listItem.addEventListener('click', () => loadChat(chatId));
         // Add a delete button to each chat item
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="material-icons">delete</i>'; // Use Material Icons
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent chat from loading when delete is clicked
            deleteChat(chatId);
        });
        listItem.appendChild(deleteButton);

        // Highlight the current chat
        if (chatId === currentChatId) {
            listItem.classList.add('current-chat');
        }
        chatList.appendChild(listItem);
    }
     // If there are no chats, display a message
    if (Object.keys(chats).length === 0) {
        chatList.innerHTML = '<li>No chats yet.</li>';
    }
}
// Function to clear all chats
function clearAllChats() {
    localStorage.removeItem('chats');
    currentChatId = null; // Reset current chat
    createNewChat(); // Start a new, empty chat
    renderChatList(); // Update the chat list
}

// Event listeners
chatForm.addEventListener('submit', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        sendMessage(e);
    }
});

// Drawer open/close
menuToggle.addEventListener('click', () => {
    navDrawer.classList.add('open');
    overlay.classList.add('open'); // Show the overlay
});

closeDrawerButton.addEventListener('click', () => {
   closeDrawer();
});

overlay.addEventListener('click', () => { // Close drawer when clicking outside
    closeDrawer();
});

function closeDrawer(){
     navDrawer.classList.remove('open');
    overlay.classList.remove('open'); // Hide the overlay
}

// Theme switching
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    // Save the theme preference
    const isLightTheme = document.body.classList.contains('light');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
     closeDrawer();
});

// Clear chat
clearChat.addEventListener('click', clearAllChats);

newChatButton.addEventListener('click', createNewChat);


// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.error('ServiceWorker registration failed: ', err);
            });
    });
}

// Initial setup on page load
window.addEventListener('load', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
    }
    // Load saved chats
    renderChatList();

    // If no chats exist, start a new chat
    const chats = loadChats();
    if(Object.keys(chats).length === 0){
        createNewChat();
    }
    else{ //load last chat
        const chatIds = Object.keys(chats);
        const lastChatId = chatIds[chatIds.length - 1];
        loadChat(lastChatId);
    }
        userInput.focus();


});
