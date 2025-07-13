// Configuration
const CONFIG = {
    API_URL: window.location.hostname === 'localhost' ? 
        'http://localhost:8000/api/chat' : 
        '/api/chat',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7
};

// Global variables
let currentChatId = null;
let chatHistory = [];
let isLoading = false;
let currentUser = null;

// DOM elements
const elements = {
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    newChatBtn: document.getElementById('newChatBtn'),
    clearChatBtn: document.getElementById('clearChatBtn'),
    messagesContainer: document.getElementById('messagesContainer'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    messages: document.getElementById('messages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    chatList: document.getElementById('chatList'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    toastContainer: document.getElementById('toastContainer'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    userIndicator: document.getElementById('userIndicator'),
    userName: document.getElementById('userName')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeApp();
    setupEventListeners();
    loadChatHistory();
});

function checkAuthentication() {
    const userData = localStorage.getItem('nova_user');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    updateUserInterface();
}

function updateUserInterface() {
    if (currentUser) {
        elements.userIndicator.textContent = currentUser.name;
        elements.userName.textContent = currentUser.name;
        
        // Update avatar based on user type
        const avatar = document.querySelector('.user-avatar i');
        if (currentUser.type === 'demo') {
            avatar.className = 'fas fa-user-circle';
        } else {
            avatar.className = 'fab fa-google';
        }
    }
}

function initializeApp() {
    // Create initial chat session
    createNewChat();
    
    // Auto-resize textarea
    autoResizeTextarea();
    
    // Update character count
    updateCharacterCount();
}

function setupEventListeners() {
    // Sidebar toggle
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    
    // New chat button
    elements.newChatBtn.addEventListener('click', createNewChat);
    
    // Clear chat button
    elements.clearChatBtn.addEventListener('click', clearCurrentChat);
    
    // Clear all chats button
    elements.clearAllBtn.addEventListener('click', clearAllChats);
    
    // Logout button
    elements.logoutBtn.addEventListener('click', logout);
    
    // Send message
    elements.sendBtn.addEventListener('click', sendMessage);
    
    // Enter key to send message
    elements.messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    elements.messageInput.addEventListener('input', function() {
        autoResizeTextarea();
        updateCharacterCount();
        toggleSendButton();
    });
    
    // Search functionality
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchClear.addEventListener('click', clearSearch);
    
    // Quick action buttons
    document.querySelectorAll('.quick-action').forEach(action => {
        action.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            elements.messageInput.value = prompt;
            sendMessage();
        });
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !elements.sidebar.contains(e.target) && 
            !elements.sidebarToggle.contains(e.target) &&
            elements.sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
}

function handleSearch() {
    const query = elements.searchInput.value.toLowerCase().trim();
    const chatItems = document.querySelectorAll('.chat-item');
    
    if (query === '') {
        // Show all chats
        chatItems.forEach(item => {
            item.classList.remove('hidden', 'highlighted');
        });
        elements.searchClear.style.display = 'none';
        return;
    }
    
    elements.searchClear.style.display = 'block';
    
    chatItems.forEach(item => {
        const title = item.querySelector('.chat-item-title').textContent.toLowerCase();
        const preview = item.querySelector('.chat-item-preview').textContent.toLowerCase();
        
        if (title.includes(query) || preview.includes(query)) {
            item.classList.remove('hidden');
            item.classList.add('highlighted');
        } else {
            item.classList.add('hidden');
            item.classList.remove('highlighted');
        }
    });
}

function clearSearch() {
    elements.searchInput.value = '';
    handleSearch();
}

function clearAllChats() {
    if (confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
        chatHistory = [];
        saveChatHistory();
        updateChatList();
        createNewChat();
        showToast('All chats cleared!', 'success');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('nova_user');
        localStorage.removeItem('nova_chat_history');
        window.location.href = 'login.html';
    }
}

function toggleSidebar() {
    elements.sidebar.classList.toggle('open');
}

function closeSidebar() {
    elements.sidebar.classList.remove('open');
}

function createNewChat() {
    currentChatId = generateChatId();
    const newChat = {
        id: currentChatId,
        title: 'New Chat',
        messages: [],
        timestamp: new Date().toISOString()
    };
    
    chatHistory.unshift(newChat);
    saveChatHistory();
    updateChatList();
    clearMessages();
    showWelcomeScreen();
    
    showToast('New chat created!', 'success');
}

function clearCurrentChat() {
    if (currentChatId) {
        const chat = chatHistory.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages = [];
            saveChatHistory();
            clearMessages();
            showWelcomeScreen();
            showToast('Chat cleared!', 'success');
        }
    }
}

function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function sendMessage() {
    const message = elements.messageInput.value.trim();
    if (!message || isLoading) return;
    
    // Hide welcome screen and show messages
    hideWelcomeScreen();
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    elements.messageInput.value = '';
    autoResizeTextarea();
    updateCharacterCount();
    toggleSendButton();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Set loading state
    setLoadingState(true);
    
    try {
        // Get AI response
        const response = await getAIResponse(message);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add AI message
        addMessage('bot', response);
        
        // Update chat title if it's the first message
        updateChatTitle(message);
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        hideTypingIndicator();
        addMessage('bot', 'Sorry, I encountered an error while processing your request. Please try again.');
        showToast('Failed to get response. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

async function getAIResponse(message) {
    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            sessionId: currentChatId
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', response.status, errorData);
        
        if (response.status === 401) {
            throw new Error('Authentication failed. Please check the API key configuration.');
        } else if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a moment.');
        } else {
            throw new Error(errorData.details || `API request failed: ${response.status}`);
        }
    }
    
    const data = await response.json();
    return data.response;
}

function addMessage(role, content) {
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (!chat) return;
    
    const message = {
        role,
        content,
        timestamp: new Date().toISOString()
    };
    
    chat.messages.push(message);
    saveChatHistory();
    updateChatList();
    
    // Create message element
    const messageElement = createMessageElement(message);
    elements.messages.appendChild(messageElement);
    
    // Scroll to bottom
    scrollToBottom();
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = message.role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = message.content;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = formatTime(message.timestamp);
    
    content.appendChild(bubble);
    content.appendChild(time);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    return messageDiv;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const bubble = document.createElement('div');
    bubble.className = 'typing-bubble';
    bubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(bubble);
    
    elements.messages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function clearMessages() {
    elements.messages.innerHTML = '';
}

function showWelcomeScreen() {
    elements.welcomeScreen.style.display = 'flex';
    elements.messages.style.display = 'none';
}

function hideWelcomeScreen() {
    elements.welcomeScreen.style.display = 'none';
    elements.messages.style.display = 'block';
}

function updateChatTitle(firstMessage) {
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (chat && chat.title === 'New Chat') {
        chat.title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;
        saveChatHistory();
        updateChatList();
    }
}

function updateChatList() {
    elements.chatList.innerHTML = '';
    
    if (chatHistory.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No chats yet. Start a conversation!</p>';
        elements.chatList.appendChild(emptyState);
        return;
    }
    
    chatHistory.forEach(chat => {
        const chatItem = createChatItem(chat);
        elements.chatList.appendChild(chatItem);
    });
}

function createChatItem(chat) {
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
    
    const lastMessage = chat.messages.length > 0 ? 
        chat.messages[chat.messages.length - 1].content : 
        'No messages yet';
    
    chatItem.innerHTML = `
        <div class="chat-item-content">
            <div class="chat-item-text">
                <div class="chat-item-title">${chat.title}</div>
                <div class="chat-item-preview">${lastMessage.substring(0, 50)}${lastMessage.length > 50 ? '...' : ''}</div>
            </div>
            <div class="chat-item-actions">
                <button class="chat-action-btn delete-btn" onclick="deleteChat('${chat.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    chatItem.addEventListener('click', function(e) {
        if (!e.target.closest('.chat-action-btn')) {
            loadChat(chat.id);
        }
    });
    
    return chatItem;
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    clearMessages();
    
    if (chat.messages.length === 0) {
        showWelcomeScreen();
    } else {
        hideWelcomeScreen();
        chat.messages.forEach(message => {
            const messageElement = createMessageElement(message);
            elements.messages.appendChild(messageElement);
        });
        scrollToBottom();
    }
    
    updateChatList();
    closeSidebar();
}

function deleteChat(chatId) {
    const index = chatHistory.findIndex(c => c.id === chatId);
    if (index === -1) return;
    
    chatHistory.splice(index, 1);
    saveChatHistory();
    
    if (currentChatId === chatId) {
        if (chatHistory.length > 0) {
            loadChat(chatHistory[0].id);
        } else {
            createNewChat();
        }
    }
    
    updateChatList();
    showToast('Chat deleted!', 'success');
}

function saveChatHistory() {
    try {
        const userKey = currentUser ? `nova_chat_history_${currentUser.type}` : 'nova_chat_history';
        localStorage.setItem(userKey, JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Failed to save chat history:', error);
    }
}

function loadChatHistory() {
    try {
        const userKey = currentUser ? `nova_chat_history_${currentUser.type}` : 'nova_chat_history';
        const saved = localStorage.getItem(userKey);
        if (saved) {
            chatHistory = JSON.parse(saved);
            updateChatList();
            
            if (chatHistory.length > 0) {
                loadChat(chatHistory[0].id);
            }
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
        chatHistory = [];
    }
}

function setLoadingState(loading) {
    isLoading = loading;
    elements.sendBtn.disabled = loading;
    elements.messageInput.disabled = loading;
    
    if (loading) {
        elements.loadingOverlay.style.display = 'flex';
    } else {
        elements.loadingOverlay.style.display = 'none';
    }
}

function autoResizeTextarea() {
    const textarea = elements.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function updateCharacterCount() {
    const count = elements.messageInput.value.length;
    const counter = document.querySelector('.character-count');
    if (counter) {
        counter.textContent = `${count}/2000`;
        counter.style.color = count > 1800 ? '#ff4757' : '#999';
    }
}

function toggleSendButton() {
    const hasText = elements.messageInput.value.trim().length > 0;
    elements.sendBtn.style.opacity = hasText ? '1' : '0.5';
}

function scrollToBottom() {
    setTimeout(() => {
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    }, 100);
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.deleteChat = deleteChat;