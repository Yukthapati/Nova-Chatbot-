# Nova AI Chatbot

A beautiful, responsive general-purpose chatbot powered by OpenAI's GPT-3.5 Turbo model. Built with pure HTML, CSS, and JavaScript for the K-HUB 2025-26 Batch recruitment challenge.

![Nova AI Chatbot](https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

- **🤖 AI-Powered Conversations**: Intelligent responses using OpenAI GPT-3.5 Turbo
- **💬 Real-time Chat Interface**: Smooth, responsive messaging experience
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **💾 Local Storage**: Persistent chat history saved in browser
- **🎨 Beautiful UI**: Modern design with animations and gradients
- **⚡ Fast Performance**: Pure JavaScript implementation
- **🔄 Chat Management**: Create, switch, and delete chat sessions
- **✨ Quick Actions**: Pre-defined prompts for common use cases

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenAI API key
- Local web server (optional, for development)

### Installation

1. **Download the files**
   ```bash
   git clone https://github.com/yourusername/nova-chatbot.git
   cd nova-chatbot
   ```

2. **Configure API Key**
   
   Open `script.js` and replace the API key in the CONFIG object:
   ```javascript
   const CONFIG = {
       API_KEY: 'your_openai_api_key_here',
       // ... other config
   };
   ```

3. **Run the application**
   
   **Option 1: Direct file opening**
   - Simply open `index.html` in your web browser
   
   **Option 2: Local server (recommended)**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Then visit `http://localhost:8000`

## 🔑 Getting Your OpenAI API Key

1. **Create an OpenAI Account**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up for a new account or log in

2. **Access API Keys**
   - Navigate to the [API Keys section](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy your API key (keep it secure!)

3. **Set Up Billing**
   - Go to [Billing settings](https://platform.openai.com/account/billing)
   - Add a payment method to enable API usage

4. **Configure the Application**
   - Open `script.js`
   - Replace `'your_openai_api_key_here'` with your actual API key
   - Save the file

## 📖 Usage Guide

### Starting a Conversation

1. **New Chat**: Click the "New Chat" button to start a fresh conversation
2. **Quick Actions**: Click on any of the suggested prompts on the welcome screen
3. **Type Message**: Enter your question in the input field at the bottom
4. **Send**: Press Enter or click the send button (paper plane icon)

### Managing Chats

- **Switch Chats**: Click on any chat in the sidebar to continue that conversation
- **Delete Chats**: Hover over a chat and click the trash icon
- **Clear Chat**: Use the clear button in the header to reset the current conversation

### Features Overview

- **Responsive Design**: Works seamlessly on all device sizes
- **Auto-save**: All conversations are automatically saved to browser storage
- **Typing Indicators**: Visual feedback when Nova is generating a response
- **Character Counter**: Shows remaining characters (2000 max per message)
- **Toast Notifications**: Success and error messages for user feedback

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Flexbox and Grid
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)
- **API**: OpenAI GPT-3.5 Turbo
- **Storage**: Browser LocalStorage

## 🏗️ Project Structure

```
nova-chatbot/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Floating Animations**: Subtle background elements
- **Smooth Transitions**: All interactions have smooth animations
- **Modern Typography**: Clean, readable font choices
- **Responsive Layout**: Adapts to any screen size

### User Experience
- **Intuitive Interface**: Easy to understand and navigate
- **Quick Actions**: Pre-defined prompts for common tasks
- **Visual Feedback**: Loading states, typing indicators, and notifications
- **Accessibility**: Keyboard navigation and screen reader friendly

## 📱 Responsive Breakpoints

- **Desktop**: > 768px - Full sidebar and expanded layout
- **Tablet**: 768px - 480px - Collapsible sidebar
- **Mobile**: < 480px - Optimized for touch interaction

## 🔧 Configuration Options

You can customize the chatbot by modifying the CONFIG object in `script.js`:

```javascript
const CONFIG = {
    API_KEY: 'your_api_key',           // Your OpenAI API key
    API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo',            // AI model to use
    MAX_TOKENS: 1000,                  // Maximum response length
    TEMPERATURE: 0.7                   // Response creativity (0-1)
};
```

## 🚀 Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop your project folder to [Netlify](https://netlify.com)
2. Your site will be deployed instantly with a custom URL

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to deploy

## 🔒 Security Considerations

- **API Key Protection**: In production, use environment variables or a backend proxy
- **CORS**: The current setup works for development; consider a backend for production
- **Rate Limiting**: Implement client-side rate limiting to avoid API quota issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the GPT-3.5 Turbo API
- [Font Awesome](https://fontawesome.com/) for the beautiful icons
- [Google Fonts](https://fonts.google.com/) for the Inter font family
- [K-HUB](https://k-hub.in/) for the internship opportunity

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Check the [OpenAI API documentation](https://platform.openai.com/docs)
- Review the browser console for error messages

## 🔄 Version History

- **v1.0.0** - Initial release with core chat functionality
- **v1.1.0** - Added responsive design and mobile optimization
- **v1.2.0** - Enhanced UI with animations and improved UX

---

Built with ❤️ for the K-HUB 2025-26 Batch recruitment challenge.

**Live Demo**: [Add your deployment URL here]

**Repository**: [Add your GitHub repository URL here]