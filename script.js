// Global variables
let currentChatId = null;
let chatHistory = [];
let apiKey = null;

// DOM elements
const elements = {
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    newChatBtn: document.getElementById('newChatBtn'),
    clearBtn: document.getElementById('clearBtn'),
    chatHistory: document.getElementById('chatHistory'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    messages: document.getElementById('messages'),
    chatContainer: document.getElementById('chatContainer'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    apiKeyModal: document.getElementById('apiKeyModal'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
    cancelBtn: document.getElementById('cancelBtn')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadChatHistory();
    checkApiKey();
});

function initializeApp() {
    createNewChat();
    autoResizeTextarea();
}

function setupEventListeners() {
    // Sidebar toggle
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    
    // New chat button
    elements.newChatBtn.addEventListener('click', createNewChat);
    
    // Clear chat button
    elements.clearBtn.addEventListener('click', clearCurrentChat);
    
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
        toggleSendButton();
    });
    
    // Example prompts
    document.querySelectorAll('.prompt-card').forEach(card => {
        card.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            elements.messageInput.value = prompt;
            sendMessage();
        });
    });
    
    // API Key modal
    elements.saveApiKeyBtn.addEventListener('click', saveApiKey);
    elements.cancelBtn.addEventListener('click', hideApiKeyModal);
    
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

function checkApiKey() {
    apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
        showApiKeyModal();
    }
}

function showApiKeyModal() {
    elements.apiKeyModal.style.display = 'flex';
}

function hideApiKeyModal() {
    elements.apiKeyModal.style.display = 'none';
}

function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();
    if (!key) {
        alert('Please enter your API key');
        return;
    }
    
    if (!key.startsWith('sk-')) {
        alert('Invalid API key format. OpenAI API keys start with "sk-"');
        return;
    }
    
    apiKey = key;
    localStorage.setItem('openai_api_key', key);
    hideApiKeyModal();
    elements.apiKeyInput.value = '';
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
    updateChatHistoryUI();
    clearMessages();
    showWelcomeScreen();
    closeSidebar();
}

function clearCurrentChat() {
    if (currentChatId) {
        const chat = chatHistory.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages = [];
            saveChatHistory();
            clearMessages();
            showWelcomeScreen();
        }
    }
}

function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function sendMessage() {
    if (!apiKey) {
        showApiKeyModal();
        return;
    }
    
    const message = elements.messageInput.value.trim();
    if (!message) return;
    
    // Hide welcome screen and show messages
    hideWelcomeScreen();
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    elements.messageInput.value = '';
    autoResizeTextarea();
    toggleSendButton();
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const response = await getAIResponse(message);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add AI message
        addMessage('assistant', response);
        
        // Update chat title if it's the first message
        updateChatTitle(message);
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        hideTypingIndicator();
        addMessage('assistant', 'Sorry, I encountered an error while processing your request. Please try again.');
        
        if (error.message.includes('401') || error.message.includes('Invalid API key')) {
            localStorage.removeItem('openai_api_key');
            apiKey = null;
            showApiKeyModal();
        }
    }
}

async function getAIResponse(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Provide clear, concise, and helpful responses.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
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
    updateChatHistoryUI();
    
    // Create message element
    const messageElement = createMessageElement(message);
    elements.messages.appendChild(messageElement);
    
    // Scroll to bottom
    scrollToBottom();
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role === 'user' ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = message.role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Format message content (handle code blocks, etc.)
    content.innerHTML = formatMessage(message.content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    return messageDiv;
}

function formatMessage(content) {
    // Simple formatting for code blocks and inline code
    content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert line breaks to paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    if (paragraphs.length > 1) {
        return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    } else {
        return `<p>${content.replace(/\n/g, '<br>')}</p>`;
    }
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(dots);
    
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
        updateChatHistoryUI();
    }
}

function updateChatHistoryUI() {
    elements.chatHistory.innerHTML = '';
    
    chatHistory.forEach(chat => {
        const chatItem = createChatItem(chat);
        elements.chatHistory.appendChild(chatItem);
    });
}

function createChatItem(chat) {
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
    
    chatItem.innerHTML = `
        <span class="chat-item-text">${chat.title}</span>
        <div class="chat-item-actions">
            <button class="delete-btn" onclick="deleteChat('${chat.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    chatItem.addEventListener('click', function(e) {
        if (!e.target.closest('.delete-btn')) {
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
    
    updateChatHistoryUI();
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
    
    updateChatHistoryUI();
}

function saveChatHistory() {
    try {
        localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Failed to save chat history:', error);
    }
}

function loadChatHistory() {
    try {
        const saved = localStorage.getItem('chat_history');
        if (saved) {
            chatHistory = JSON.parse(saved);
            updateChatHistoryUI();
            
            if (chatHistory.length > 0) {
                loadChat(chatHistory[0].id);
            }
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
        chatHistory = [];
    }
}

function autoResizeTextarea() {
    const textarea = elements.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function toggleSendButton() {
    const hasText = elements.messageInput.value.trim().length > 0;
    elements.sendBtn.disabled = !hasText;
}

function scrollToBottom() {
    setTimeout(() => {
        elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }, 100);
}

// Make deleteChat available globally
window.deleteChat = deleteChat;