const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  console.log('Received chat request:', { message: req.body.message, sessionId: req.body.sessionId });
  
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      console.log('Error: No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is properly configured
    const apiKey = process.env.OPENAI_API_KEY || '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';
    
    console.log('API Key configured:', apiKey ? 'Yes' : 'No');
    console.log('API Key format valid:', apiKey.startsWith('sk-') ? 'Yes' : 'No');
    
    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format. OpenAI keys should start with "sk-"');
      return res.status(500).json({ 
        error: 'API configuration error',
        details: 'Invalid API key format. Please check your OpenAI API key.' 
      });
    }

    console.log('Making request to OpenAI API...');
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
            content: 'You are Nova, a helpful and intelligent AI assistant. Provide clear, concise, and helpful responses.'
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

    console.log('OpenAI API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'Authentication failed',
          details: 'Invalid OpenAI API key. Please check your API key configuration.' 
        });
      } else if (response.status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again later.' 
        });
      } else {
        return res.status(500).json({ 
          error: 'OpenAI API error',
          details: `API returned status ${response.status}` 
        });
      }
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    const aiResponse = data.choices[0].message.content;
    console.log('AI Response:', aiResponse.substring(0, 100) + '...');

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Nova Chatbot server running at http://localhost:${PORT}`);
  console.log(`📱 Open your browser and navigate to the URL above`);
  console.log(`🔑 API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'Using fallback'}`);
});

module.exports = app;