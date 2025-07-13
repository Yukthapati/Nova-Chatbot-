# Nova AI Chatbot

A beautiful, responsive general-purpose chatbot powered by OpenAI's GPT-3.5 Turbo model. Built with HTML, CSS, JavaScript, and Node.js backend.

![Nova AI Chatbot](https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

- **🤖 AI-Powered Conversations**: Intelligent responses using OpenAI GPT-3.5 Turbo
- **💬 Real-time Chat Interface**: Smooth, responsive messaging experience
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **💾 Local Storage**: Persistent chat history saved in browser
- **🎨 Beautiful UI**: Modern design with animations and gradients
- **⚡ Fast Performance**: Optimized Node.js backend with Express
- **🔄 Chat Management**: Create, switch, and delete chat sessions
- **✨ Quick Actions**: Pre-defined prompts for common use cases

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nova-chatbot.git
   cd nova-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8000`

## 🌐 Deployment

### Deploy to Render

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Use the following settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

2. **Set Environment Variables**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`

3. **Deploy**
   - Render will automatically deploy your application
   - Your app will be available at your Render URL

### Deploy to Heroku

1. **Install Heroku CLI and login**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your_api_key_here
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. **Connect your GitHub repository to Railway**
2. **Set environment variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`
3. **Deploy automatically**

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

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **API**: OpenAI GPT-3.5 Turbo
- **Storage**: Browser LocalStorage
- **Styling**: Custom CSS with Flexbox and Grid
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)

## 🏗️ Project Structure

```
nova-chatbot/
├── index.html          # Main HTML file
├── login.html          # Login page
├── styles.css          # All CSS styles and animations
├── script.js           # Frontend JavaScript
├── server.js           # Node.js Express server
├── package.json        # Dependencies and scripts
├── render.yaml         # Render deployment config
├── .env.example        # Environment variables template
└── README.md           # This documentation
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `NODE_ENV`: Set to `production` for production deployment
- `PORT`: Server port (default: 8000)

### API Configuration

The chatbot uses the following OpenAI API settings:
- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: 1000
- **Temperature**: 0.7

You can modify these in the `server.js` file if needed.

## 🔒 Security Considerations

- **API Key Protection**: Store your OpenAI API key in environment variables
- **CORS**: Properly configured for cross-origin requests
- **Rate Limiting**: Consider implementing rate limiting for production use
- **Input Validation**: Basic input validation is implemented

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

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Check the [OpenAI API documentation](https://platform.openai.com/docs)
- Review the browser console for error messages

## 🔄 Version History

- **v1.0.0** - Initial release with core chat functionality
- **v1.1.0** - Added responsive design and mobile optimization
- **v1.2.0** - Enhanced UI with animations and improved UX
- **v2.0.0** - Added Node.js backend with proper API integration

---

Built with ❤️ for real-time AI conversations.

**Live Demo**: [Add your deployment URL here]

**Repository**: [Add your GitHub repository URL here]